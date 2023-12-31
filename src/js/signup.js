import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../css/Signup.css";

function Registration() {
  const urlServer = "http://localhost:3001/api";
  const [section, setSection] = useState(1);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [cardNo, setCardNo] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  const history = useNavigate();

  const handleContinue = () => {
    if (section === 1) {
      if (email && username && password && confirmPassword) {
        if (password !== confirmPassword) {
          alert("Password and Confirm Password must match");
          return;
        }
        setSection(section + 1);
      } else {
        alert("Please fill in all required fields in the first section");
      }
    }
  };

  const handleBack = () => {
    setSection(section - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = { email, password, dob, gender, username, cardNo };
      setLoading(true);

      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error("Registration failed " + errorMessage);
      }

      const { success } = await response.json();

      if (success) {
        history("/login");
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  return (
    <div className="login">
      <form className="login-form registration-form" onSubmit={handleSubmit}>
        {section === 1 && (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
            <div className="password-input">
              <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                minLength={6}
                required
              />
              <span
                className="password-toggle-icon"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              placeholder="Date of Birth"
              required
            />
            <input
              type="text"
              value={cardNo}
              onChange={(e) => setCardNo(e.target.value)}
              placeholder="Credit card number"
              required
            />
            <select
              id="gender"
              value={gender}
              onChange={handleGenderChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
            <div className="register-link">
              Already have an account? <Link to="/login">Login</Link>
            </div>
            <button type="submit">Submit</button>
          </>
        )}
      </form>
    </div>
  );
}

export default Registration;
