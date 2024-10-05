import Route from "./Route";
import axios from "axios";
import UserContextProvider from "./UserContext";

function App() {
  axios.defaults.baseURL = "http://localhost:8000";
  axios.defaults.withCredentials = true;

  return (
    <UserContextProvider>
      <Route />
    </UserContextProvider>
  );
}

export default App;
