import { useContext } from "react";
import Register from "./Register";
import { UserContext } from "./UserContext";
import Chat from "./Chat";

export default function Route() {
  const { username } = useContext(UserContext);

  return username ? <Chat /> : <Register />;
}
