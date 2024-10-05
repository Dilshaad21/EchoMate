import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

// eslint-disable-next-line react/prop-types
export default function UserContextProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    axios
      .get("/profile")
      .then((res) => {
        const { username, id } = res.data.data;
        setUsername(username);
        setId(id);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername, id, setId }}>
      {children}
    </UserContext.Provider>
  );
}
