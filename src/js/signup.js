import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../css/Signup.css';

function Registration() {
  const [section, setSection] = useState(1);
  const [loading, setLoading] = useState(false);
  // First section fields
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Second section fields
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');

  // Third section fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const history = useNavigate();

  const handleContinue = () => {
    if (section === 1) {
      if (email && username && password && confirmPassword) {
        if (password !== confirmPassword) {
          alert('Password and Confirm Password must match');
          return;
        }
        setSection(section + 1);
      } else {
        alert('Please fill in all required fields in the first section');
      }
    } else if (section === 2) {
      if (dob && gender) {
        setSection(section + 1);
      } else {
        alert('Please fill in all required fields in the second section');
      }
    }
  };

  const handleBack = () => {
    setSection(section - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Password and Confirm Password must match');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          dob,
          gender,
          street,
          city,
          province,
          postalCode,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error('Registration failed ' + errorMessage);
      }

      const { success, userId } = await response.json();

      if (success) {
        //localStorage.setItem('userId', userId);
        history('/login');
      } else {
        throw new Error('Registration failed');
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
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
            <div className="password-input">
              <input
                type={passwordVisible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                minLength={6}
                required
              />
              <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
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
            <div className="register-link">
              Already have an account? <Link to="/login">Login</Link>
            </div>
            <button type="button" onClick={handleContinue}>Continue</button>
          </>
        )}

        {section === 2 && (
          <>
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} placeholder="Date of Birth" required />
            
            <select id="gender" value={gender} onChange={handleGenderChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="PreferNotToAnswer">Prefer Not to Answer</option>
            </select>
            <button type="button" onClick={handleBack}>Back</button>
            <button type="button" onClick={handleContinue}>Continue</button>
          </>
        )}

        {section === 3 && (
          <>
            <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Street" required />
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" required />
            <input type="text" value={province} onChange={(e) => setProvince(e.target.value)} placeholder="Province" required />
            <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Postal Code" required />
            <button type="button" onClick={handleBack}>Back</button>
            <button type="submit">Submit</button>
          </>
        )}
      </form>
    </div>
  );
}

export default Registration;
