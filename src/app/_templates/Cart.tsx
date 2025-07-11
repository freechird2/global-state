"use client";

import { useAtom } from "@/lib/useAtom";
import { cartAtom, userAtom } from "@/store/store";
import {
  Badge,
  Button,
  Card,
  Container,
  Header,
  Nav,
  NavLink,
} from "@/styles/common";
import Link from "next/link";

const Cart = () => {
  const [user, setUser] = useAtom(userAtom);
  const [cart, setCart] = useAtom(cartAtom);

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

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
              {cart.length > 0 && <Badge>{cart.length}</Badge>}
            </NavLink>
            {user && (
              <span style={{ color: "white", margin: "0 1rem" }}>
                안녕하세요, {user.name}님!
              </span>
            )}
          </div>
        </Nav>
      </Header>

      <Container>
        <h1>�� 장바구니</h1>

        {!user ? (
          <Card>
            <h2>⚠️ 로그인이 필요합니다</h2>
            <p>장바구니를 사용하려면 먼저 로그인해주세요.</p>
            <Link href="/">
              <Button>홈으로 돌아가기</Button>
            </Link>
          </Card>
        ) : cart.length === 0 ? (
          <Card>
            <h2>�� 장바구니가 비어있습니다</h2>
            <p>상품을 추가해보세요!</p>
            <Link href="/">
              <Button>쇼핑 계속하기</Button>
            </Link>
          </Card>
        ) : (
          <>
            <Card>
              <h2>👤 사용자 정보</h2>
              <p>
                <strong>이름:</strong> {user.name}
              </p>
              <p>
                <strong>이메일:</strong> {user.email}
              </p>
            </Card>

            <Card>
              <h2>🛒 장바구니 상품 ({cart.length}개)</h2>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem 0",
                    borderBottom: "1px solid #e9ecef",
                  }}
                >
                  <div>
                    <h3>{item.name}</h3>
                    <p>₩{item.price.toLocaleString()}</p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <Button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        style={{ padding: "0.25rem 0.5rem" }}
                      >
                        -
                      </Button>
                      <span style={{ margin: "0 0.5rem" }}>
                        {item.quantity}
                      </span>
                      <Button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        style={{ padding: "0.25rem 0.5rem" }}
                      >
                        +
                      </Button>
                    </div>
                    <div>
                      <strong>
                        ₩{(item.price * item.quantity).toLocaleString()}
                      </strong>
                    </div>
                    <Button
                      onClick={() => removeFromCart(item.id)}
                      style={{ background: "#dc3545" }}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              ))}
            </Card>

            <Card>
              <h2>💰 결제 정보</h2>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3>총 결제 금액</h3>
                <h2>₩{totalPrice.toLocaleString()}</h2>
              </div>
              <Button style={{ width: "100%", marginTop: "1rem" }}>
                결제하기
              </Button>
            </Card>
          </>
        )}
      </Container>
    </>
  );
};

export default Cart;
