"use client";

import { useAtom } from "@/lib/useAtom";
import { cartAtom, userAtom } from "@/store/store";
import {
  Badge,
  Button,
  Card,
  Container,
  Grid,
  Header,
  Nav,
  NavLink,
} from "@/styles/common";
import { useEffect } from "react";

const HomePage = () => {
  const [user, setUser] = useAtom(userAtom);
  const [cart, setCart] = useAtom(cartAtom);

  const login = () => {
    setUser({
      id: "1",
      name: "홍길동",
      email: "hong@example.com",
      isLoggedIn: true,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const addToCart = (product: { id: string; name: string; price: number }) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  useEffect(() => {
    console.log({ user });
  }, [user]);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <Header>
        <Nav>
          <div>
            <NavLink href="/">🏥 MediStream</NavLink>
          </div>
          <div>
            <NavLink href="/">홈</NavLink>
            <NavLink href="/cart">
              �� 장바구니
              {cartItemCount > 0 && <Badge>{cartItemCount}</Badge>}
            </NavLink>

            {user ? (
              <>
                <span style={{ color: "white", margin: "0 1rem" }}>
                  안녕하세요, {user.name}님!
                </span>
                <Button onClick={logout}>로그아웃</Button>
              </>
            ) : (
              <Button onClick={login}>로그인</Button>
            )}
          </div>
        </Nav>
      </Header>

      <Container>
        <h1>🏥 MediStream - 의료 서비스 플랫폼</h1>

        <Card>
          <h2>👤 사용자 상태</h2>
          {user ? (
            <div>
              <p>
                <strong>이름:</strong> {user.name}
              </p>
              <p>
                <strong>이메일:</strong> {user.email}
              </p>
              <p>
                <strong>상태:</strong> 로그인됨 ✅
              </p>
            </div>
          ) : (
            <p>로그인이 필요합니다.</p>
          )}
        </Card>

        <Card>
          <h2>🛒 장바구니 상태</h2>
          <p>총 {cartItemCount}개 상품이 장바구니에 있습니다.</p>
          {cart.length > 0 && (
            <ul>
              {cart.map((item) => (
                <li key={item.id}>
                  {item.name} - {item.quantity}개 (₩
                  {item.price.toLocaleString()})
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2>🛍️ 상품 목록</h2>
          <Grid>
            {[
              { id: "1", name: "혈압계", price: 50000 },
              { id: "2", name: "체온계", price: 30000 },
              { id: "3", name: "혈당계", price: 80000 },
              { id: "4", name: "산소포화도계", price: 120000 },
            ].map((product) => (
              <div key={product.id}>
                <h3>{product.name}</h3>
                <p>₩{product.price.toLocaleString()}</p>
                <Button onClick={() => addToCart(product)}>
                  장바구니에 추가
                </Button>
              </div>
            ))}
          </Grid>
        </Card>

        <Card>
          <h2>🧪 전역 상태 테스트</h2>
          <p>
            이 페이지에서 로그인하거나 상품을 장바구니에 추가한 후, 다른
            페이지로 이동해보세요.
          </p>
          <p>전역 상태가 페이지 간에 공유되는 것을 확인할 수 있습니다.</p>
        </Card>
      </Container>
    </>
  );
};

export default HomePage;
