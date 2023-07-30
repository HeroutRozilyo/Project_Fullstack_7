import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "../css/Login.css"; // import the CSS file

function Login() {
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Add a state variable to track loading state
  const history = useNavigate();
  useEffect(() => {
    // Check if the user is already logged out (local storage is empty)
    if (localStorage.getItem("user")) {
      // Clear local storage to ensure the user data is removed
      localStorage.clear();
      
      // Use replace to prevent navigating back to the previous page
      window.location.replace("/");
      history.replace("/");
    }
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Show loading indicator
      setLoading(true);

      const response = await fetch("http://localhost:3001/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email, password }),
      });

      if (!response.ok) {
        // Handle network errors
        throw new Error("Network error");
      }

      const { success, user } = await response.json();

      if (success) {
        // Save the user object in local storage
        localStorage.setItem("user", JSON.stringify(user));

        // Check if the user is an admin
        if (user.isAdmin) {
          // Redirect to the admin page
          history("/AllSongs");
        } else {
          // Redirect to the main screen for regular users
          history(`/users/${user.UserName}/main`);
        }
      } else {
        // Authentication failed
        throw new Error("Invalid login credentials");
      }
    } catch (error) {
      // Show error message to user
      alert(`Error: ${error.message}`);
    } finally {
      // Hide loading indicator
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
        {/* Update button text based on loading state */}
      </form>
    </div>
  );
}

export default Login;
