import { useContext } from "react";
import Register from "./Register";
import { UserContext } from "./UserContext";

export default function Route() {
  const { username } = useContext(UserContext);

  if (username) return `Inside logged in page ${username}`;

  return <Register />;
}
