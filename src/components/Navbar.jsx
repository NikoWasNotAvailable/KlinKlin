import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import profileIcon from '../assets/profile.png';
import './Navbar.css';
import { jwtDecode } from 'jwt-decode';


function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username);
        setIsLoggedIn(true);
      } catch (err) {
        console.error('Invalid token');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleLoginClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  // ✅ Set white background for both /laundry and /laundrydetail
  const isWhiteBackground =
    location.pathname.startsWith('/laundry') ||
    location.pathname.startsWith('/order') ||
    location.pathname === '/metodepembayaran' ||
    location.pathname.startsWith('/owner/confirm');

  return (
    <nav className={"navbar"} >
      <div className="navbar-brand">
        <img src={logo} alt="Logo" className="logo-image" />
        <span className="brand-text">KlinKlin</span>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : undefined}>Home</NavLink>
        </li>
        <li>
          {/* ✅ Add custom active condition for laundry & laundrydetail */}
          <NavLink
            to="/laundry"
            className={() =>
              location.pathname.startsWith('/laundry') ? 'active-link' : undefined
            }
          >
            Laundry
          </NavLink>
        </li>
        <li>
          <NavLink to="/order" className={({ isActive }) => isActive ? 'active-link' : undefined}>Order</NavLink>
        </li>
      </ul>

      <div className="navbar-login" onClick={handleLoginClick}>
        {isLoggedIn ? (
          <div className="profile-wrapper">
            <img src={profileIcon} alt="Profile" className="profile-icon" />
            <span className="tooltip">{username}</span>
          </div>
        ) : (
          <span className="login-text">Login</span>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
