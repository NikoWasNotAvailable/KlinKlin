import { NavLink, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  // Cek jika path adalah /laundry atau /order
  const isWhiteBackground = location.pathname === '/laundry' || location.pathname === '/order';

  return (
    <nav className={`navbar ${isWhiteBackground ? 'white-background' : ''}`}>
      <div className="navbar-brand">
        <img src={logo} alt="Logo" className="logo-image" />
        <span className="brand-text">KlinKlin</span>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : undefined}>Home</NavLink>
        </li>
        <li>
          <NavLink to="/laundry" className={({ isActive }) => isActive ? 'active-link' : undefined}>Laundry</NavLink>
        </li>
        <li>
          <NavLink to="/order" className={({ isActive }) => isActive ? 'active-link' : undefined}>Order</NavLink>
        </li>
      </ul>
      <div className="navbar-login">
        <span className="login-text">Login</span>
      </div>
    </nav>
  );
}

export default Navbar;
