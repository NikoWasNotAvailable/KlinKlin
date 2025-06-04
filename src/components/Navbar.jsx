import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Navbar.css'; 

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="Logo" className="logo-image" />
        <span className="brand-text">KlinKlin</span>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'active-link' : undefined}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/laundry" 
            className={({ isActive }) => isActive ? 'active-link' : undefined}
          >
            Laundry
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/login" 
            className={({ isActive }) => isActive ? 'active-link' : undefined}
          >
            Login
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;