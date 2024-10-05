import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(true);

  const { setId, setUsername: setLoggedInUsername } = useContext(UserContext);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const url = isRegister ? "/register" : "/login";
    axios
      .post(url, { username, password })
      .then((res) => {
        const { user } = res.data.data;
        setLoggedInUsername(user.username);
        setId(user.id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="bg-blue-50 h-screen flex items-center">
        <form
          action="post"
          className="w-64 mx-auto mb-12"
          onSubmit={handleSubmit}
        >
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
            {isRegister ? "Register" : "Login"}
          </button>
          <div className="text-center mt-2">
            {isRegister ? (
              <div>
                Already a member?{" "}
                <a
                  href=""
                  onClick={(ev) => {
                    ev.preventDefault();
                    setIsRegister(false);
                  }}
                >
                  Login here
                </a>
              </div>
            ) : (
              <div>
                Dont have an account?
                <a
                  href=""
                  onClick={(ev) => {
                    ev.preventDefault();
                    setIsRegister(true);
                  }}
                >
                  Register here
                </a>
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
