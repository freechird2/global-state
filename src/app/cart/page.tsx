import { getServerState } from "@/lib/atom";
import { cookies } from "next/headers";
import Cart from "../_templates/Cart";

const CartPage = async () => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  const user = getServerState("user", null, cookieString);
  console.log(user);
  return <Cart />;
};

export default CartPage;
