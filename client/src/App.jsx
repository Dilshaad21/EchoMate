import Register from "./Register";
import axios from "axios";

function App() {
  axios.defaults.baseURL = "http://localhost:8000";
  axios.defaults.withCredentials = true;
  return (
    <>
      <div className="bg-blue-50">
        <Register></Register>
      </div>
    </>
  );
}

export default App;
