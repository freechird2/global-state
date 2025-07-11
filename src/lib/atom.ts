type Subscriber<T> = (val: T) => void;

export interface Atom<T> {
  get: () => T;
  set: (newValue: T) => void;
  subscribe: (cb: Subscriber<T>) => () => void;
  id: string;
}

// GlobalStore 클래스를 atom.ts에 직접 포함
class GlobalStore {
  private atoms = new Map<string, any>();

  constructor() {}

  getAtom<T>(
    key: string,
    initialValue: T,
    useCookie: boolean = false,
  ): Atom<T> {
    if (!this.atoms.has(key)) {
      const atom = this.createAtom(initialValue, key, useCookie);
      this.atoms.set(key, atom);
    }
    return this.atoms.get(key);
  }

  // Server Component에서 사용할 함수 추가
  getServerState<T>(key: string, defaultValue: T, cookieString?: string): T {
    // 서버에서는 쿠키 문자열을 파라미터로 받아서 파싱
    if (typeof window === "undefined") {
      if (cookieString) {
        try {
          const cookieValue = cookieString
            .split("; ")
            .find((row) => row.startsWith(`${key}=`))
            ?.split("=")[1];

          if (cookieValue) {
            const decoded = decodeURIComponent(cookieValue);
            const parsed = JSON.parse(decoded);
            return parsed;
          }
        } catch (error) {
          // 쿠키 파싱 실패 시 기본값 사용
        }
      }
      return defaultValue;
    }

    // 클라이언트에서는 기존 방식 사용
    return this.getFromCookie(key, defaultValue);
  }

  private createAtom<T>(
    initialValue: T,
    key: string,
    useCookie: boolean,
  ): Atom<T> {
    // 쿠키에서 초기값 복원
    let value = initialValue;
    if (useCookie && typeof window !== "undefined") {
      value = this.getFromCookie(key, initialValue);
    }

    const subscribers = new Set<Subscriber<T>>();

    return {
      id: key,
      get: () => value,
      set: (newValue: T) => {
        if (Object.is(value, newValue)) return;
        value = newValue;

        // 쿠키에 저장
        if (useCookie && typeof window !== "undefined") {
          this.saveToCookie(key, newValue);
        }

        subscribers.forEach((cb) => cb(value));
      },
      subscribe: (cb: Subscriber<T>) => {
        subscribers.add(cb);
        return () => {
          subscribers.delete(cb);
        };
      },
    };
  }

  private getFromCookie<T>(key: string, defaultValue: T): T {
    // 서버에서는 쿠키 접근 불가능
    if (typeof window === "undefined") {
      return defaultValue;
    }

    // 클라이언트에서만 document.cookie 사용
    try {
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${key}=`))
        ?.split("=")[1];

      if (cookieValue) {
        const decoded = decodeURIComponent(cookieValue);
        const parsed = JSON.parse(decoded);
        return parsed;
      }
    } catch (error) {
      // 쿠키 복원 실패 시 기본값 사용
    }
    return defaultValue;
  }

  private saveToCookie<T>(key: string, value: T) {
    try {
      // 민감한 정보 필터링
      const safeValue = this.filterSensitiveData(value);
      const cookieValue = encodeURIComponent(JSON.stringify(safeValue));

      // 쿠키 크기 제한 확인 (4KB)
      if (cookieValue.length > 4000) {
        return;
      }

      document.cookie = `${key}=${cookieValue}; path=/; max-age=86400; SameSite=Strict`;
    } catch (error) {
      // 쿠키 저장 실패 시 무시
    }
  }

  private filterSensitiveData<T>(value: T): T {
    // 민감한 필드 제거
    if (typeof value === "object" && value !== null) {
      const filtered = { ...value };
      delete (filtered as any).password;
      delete (filtered as any).token;
      delete (filtered as any).secret;
      delete (filtered as any).apiKey;
      delete (filtered as any).privateKey;
      return filtered;
    }
    return value;
  }
}

// 모듈 레벨에서 싱글톤 인스턴스 생성 (절대 재생성되지 않음)
let globalStoreInstance: GlobalStore | null = null;

function getGlobalStore(): GlobalStore {
  if (!globalStoreInstance) {
    globalStoreInstance = new GlobalStore();
  }
  return globalStoreInstance;
}

// GlobalStore를 사용하는 createAtom (쿠키 옵션 추가)
export function createAtom<T>(
  initialValue: T,
  key?: string,
  options?: { useCookie?: boolean },
): Atom<T> {
  const globalStore = getGlobalStore();
  const atomKey = key || `atom-${Date.now()}-${Math.random()}`;
  const useCookie = options?.useCookie ?? false;

  return globalStore.getAtom(atomKey, initialValue, useCookie);
}

// Server Component에서 사용할 함수 수정
export function getServerState<T>(
  key: string,
  defaultValue: T,
  cookieString?: string,
): T {
  // 서버에서는 항상 기본값 반환 (쿠키 접근 불가)

  // 클라이언트에서는 실제 상태 반환
  const globalStore = getGlobalStore();
  return globalStore.getServerState(key, defaultValue, cookieString);
}
