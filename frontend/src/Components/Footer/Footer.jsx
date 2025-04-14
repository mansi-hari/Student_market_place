import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaShoppingBag, FaUserPlus, FaEnvelope, FaMapMarker } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-good">
      <div className="footer-good-container">
        <div className="footer-good-brand">
          <h3>Student Marketplace</h3>
          <p>Your one-stop shop for campus essentials.</p>
          <div className="footer-good-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaHome />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaShoppingBag />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaUserPlus />
            </a>
          </div>
        </div>

        <div className="footer-good-links">
          <h4>Quick Access</h4>
          <ul>
            <li><Link to="/"><FaHome /> Home</Link></li>
            <li><Link to="/products"><FaShoppingBag /> Products</Link></li>
            <li><Link to="/sell"><FaUserPlus /> Sell Item</Link></li>
            <li><Link to="/wishlist"><FaShoppingBag /> Wishlist</Link></li>
          </ul>
        </div>

        <div className="footer-good-contact">
          <h4>Get in Touch</h4>
          <p><FaEnvelope /> help@studentmarketplace.com</p>
          <p><FaMapMarker /> Mohan Nagar, Ghaziabad, India</p>
        </div>
      </div>

      <div className="footer-good-bottom">
        <p>© {new Date().getFullYear()} Student Marketplace | Built for Students, by Students</p>
      </div>
    </footer>
  );
};

export default Footer;