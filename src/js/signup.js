import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../css/Signup.css'


function Registration() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // Track the visibility state of the password
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Password and Confirm Password must match');
      return;
    }

    try {
      setLoading(true);
    
      const userResponse = await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, username, email, phone, website }),
      });
    
      if (!userResponse.ok) {
        const errorMessage = await userResponse.text();
        throw new Error('Registration failed ' + errorMessage);
      }
    
      const passwordResponse = await fetch('http://localhost:3001/api/passwords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
    
      if (!passwordResponse.ok) {
        const errorMessage = await passwordResponse.text();
        throw new Error('Registration failed ' + errorMessage);
      }
    
      history('/login');
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };    

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="login">
      <form className="login-form registration-form" onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" required />
        <input type="text" pattern='[\w\.]{3,}' value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website" required />
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
          Already have an account? <Link to='/login'>Login</Link>
        </div>
        <button type="submit">{loading ? 'Loading...' : 'Register'}</button>
      </form>
    </div>
  );
}

export default Registration;
