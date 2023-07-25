import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Login.css"; // import the CSS file

function Login() {
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Add a state variable to track loading state
  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Show loading indicator
      setLoading(true);

      const response = await fetch("http://localhost:3001/api/login", {
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

        // Redirect to the main screen or perform any necessary actions
        // history(`/users/${Email}`);
        history(`/users/${user.username}/main`);
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
