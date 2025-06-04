import { FaFacebookF, FaTwitter, FaInstagram, FaGoogle } from 'react-icons/fa'
import logo from '../assets/logo.png'
import google from '../assets/google.webp'
import facebook from '../assets/facebook.png'
import twitter from '../assets/twitter.png'
import instagram from '../assets/instagram.png'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-top">
        <div className="footer-left">
          <div className="brand-logo">
            <img src={logo} alt="KlinKlin Logo" />
            <h3>KlinKlin</h3>
          </div>
          <p>Selamat datang di KlinKlin, tempat terbaik untuk mencuci pakaian Anda dengan cepat dan efisien.</p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img src={facebook} alt="Facebook" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <img src={twitter} alt="Twitter" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img src={instagram} alt="Instagram" />
            </a>
            <a href="https://google.com" target="_blank" rel="noopener noreferrer">
              <img src={google} alt="Google" />
            </a>
          </div>
        </div>


        <div className="footer-right">
          <h4>Pages</h4>
          <ul className="footer-links">
            <li>Home</li>
            <li>Services</li>
            <li>Profile</li>
            <li>Contact Us</li>
            <li>About Us</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-left-text">
          Terms & Condition | Privacy Policy
        </div>
        <div className="footer-right-text">
          Copyright © 2020 KlinKlin | Made in Indonesia
        </div>
      </div>
    </footer>
  )
}

export default Footer
