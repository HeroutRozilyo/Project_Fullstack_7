import "./App.css";
import Login from "../src/js/login.js";
import Main from "../src/js/main.js";
import Register from "./js/signup.js";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
