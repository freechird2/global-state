# 상태 관리 라이브러리 구현

## 🏗️ 구조 설명

### Atom 시스템

- 각 Atom은 독립적인 상태 단위
- 자체 구독자 관리 (Set<Subscriber>)
- 값 변경 시 구독자들에게 알림

### 구독 시스템

- `subscribe` 메서드로 구독자 등록
- `Object.is`를 사용한 값 비교로 불필요한 리렌더링 방지
- unsubscribe 시 메모리 정리

### React 연동

- `useSyncExternalStore` 사용으로 SSR 호환성 확보
- atom 단위로 컴포넌트 리렌더링 최적화

## 🛠️ 기술적 선택

1. **useSyncExternalStore**: React 18의 권장 방식으로 SSR 호환성 확보
2. **Object.is 비교**: 참조 동등성으로 정확한 값 비교
3. **Set 기반 구독자 관리**: O(1) 시간복잡도로 효율적인 구독자 관리

## 🔄 값 비교 방식

`Object.is(value, newValue)` 사용:

- 원시값: 값 비교
- 객체: 참조 비교
- 불필요한 리렌더링 방지

## ⚛️ React 연동 문제 및 해결

**문제**: SSR 환경에서 hydration 불일치
**해결**: `useSyncExternalStore` 사용으로 서버/클라이언트 상태 동기화

## 🚀 추가 구현 계획

1. **파생 Atom**: 계산된 상태 구현
2. **비동기 Atom**: Promise 기반 상태 관리
3. **배치 업데이트**: 여러 atom 동시 업데이트 최적화
