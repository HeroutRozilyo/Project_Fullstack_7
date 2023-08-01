import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Login.css";

function Login() {
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("user")) {
      localStorage.clear();

      window.location.replace("/");
      history.replace("/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("http://localhost:3001/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email, password }),
      });

      if (!response.ok) {
        throw new Error("Network error");
      }

      const { success, user } = await response.json();

      if (success) {
        localStorage.setItem("user", JSON.stringify(user));

        if (user.isAdmin) {
          //history("/UserList");
          //  history("/allSongs");
          history("/admin");
        } else {
          history(`/users/${user.UserName}/main`);
        }
      } else {
        throw new Error("Invalid login credentials");
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <div className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
        <button type="submit">{loading ? "Loading..." : "Login"}</button>{" "}
      </form>
    </div>
  );
}

export default Login;
