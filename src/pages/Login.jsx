import { useState } from 'react';
import logo from '../assets/logo.png';
import google from '../assets/google.webp';
import facebook from '../assets/facebook.png';
import twitter from '../assets/twitter.png';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in:', { username, password });
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
              <label>
                Email{' '}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-element">
              <label>
                Password{' '}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="remember">
              <div>
                <input type="checkbox" className="checkbox"/> Remember me
              </div>
              <a href="#">
                Forget Password?
              </a>
            </div>
            <button type="submit">Log In</button>
            <div className="or"> 
              <hr></hr> or <hr></hr>
            </div>

            <div className="social-login">
              <div className="social-button google">
                <img className="provider-icon" src={google}/>
              </div>
              <div className="social-button facebook">
                <img className="provider-icon" src={facebook}/>
              </div>
              <div className="social-button twitter">
                <img className="provider-icon" src={twitter}/>
              </div>
            </div>

            <span>Don't have an account? <a href="#">Create Account</a></span>
          </form>
        </div>
      </div>
      <div className="login-image" />
    </div>
  );
}
