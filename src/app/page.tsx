import { getServerState } from "@/lib/atom";
import HomePage from "./_templates/Home";

export default function Home() {
  const user = getServerState("user", null);
  console.log(user);
  return <HomePage />;
}
