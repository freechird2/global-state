import { createAtom } from "@/lib/atom";

interface User {
  id: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// 쿠키를 사용하는 atom (서버와 공유)
export const userAtom = createAtom<User | null>(null, "user", {
  useCookie: true,
});

// 쿠키를 사용하는 atom (서버와 공유)
export const cartAtom = createAtom<CartItem[]>([], "cart");
