import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const register = (ev) => {
    ev.preventDefault()
    axios
      .post("/register", { username, password })
      .then((res) => {
        console.log(`Registered the user successfully. Response ${res}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="bg-blue-50 h-screen flex items-center">
        <form action="post" className="w-64 mx-auto mb-12" onSubmit={register}>
          <input
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
            type="text"
            placeholder="Username"
            className="block w-full rounded-sm p-2 m-2 border"
          />
          <input
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            type="password"
            placeholder="Password"
            className="block w-full rounded-sm p-2 m-2 border"
          />
          <button
            className="bg-blue-500 text-white block w-full rounded-sm m-2 p-2"
            type="submit"
          >
            Register
          </button>
        </form>
      </div>
    </>
  );
}
