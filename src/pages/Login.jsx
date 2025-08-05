import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import google from '../assets/google.webp';
import facebook from '../assets/facebook.png';
import twitter from '../assets/twitter.png';
import './Login.css';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ If already logged in, redirect to /home
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded && decoded.exp * 1000 > Date.now()) {
          navigate('/home');
        }
      } catch (err) {
        console.error('Invalid token');
        localStorage.removeItem('token');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
      } else {
        localStorage.setItem('token', data.token);
        navigate('/home'); // 👈 redirect after successful login
      }
    } catch (err) {
      console.log(err);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="brand">
          <img src={logo} alt="Logo" className="logo-image" />
          <span className="brand-text">KlinKlin</span>
        </div>
        <div className="login-form">
          <h1>Welcome</h1>
          <h2>Please Login to wash</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-element">
              <label>Email</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-element">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="remember">
              <div>
                <input type="checkbox" className="checkbox" /> Remember me
              </div>
              <a href="#">Forget Password?</a>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>

            <div className="or">
              <hr /> or <hr />
            </div>

            <div className="social-login">
              <div className="social-button google">
                <img className="provider-icon" src={google} alt="Google" />
              </div>
              <div className="social-button facebook">
                <img className="provider-icon" src={facebook} alt="Facebook" />
              </div>
              <div className="social-button twitter">
                <img className="provider-icon" src={twitter} alt="Twitter" />
              </div>
            </div>

            <span>
              Don't have an account? <a href="/signup">Create Account</a>
            </span>
          </form>
        </div>
      </div>
      <div className="login-image" />
    </div>
  );
}
