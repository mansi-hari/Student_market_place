import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5">
      <div className="container">
        <div className="row g-4">
          {/* Logo and Description */}
          <div className="col-md-3">
            <Link to="/" className="d-flex align-items-center text-decoration-none text-light">
              <img src={logo || "/placeholder.svg"} alt="Student Marketplace" className="me-2" style={{ height: '40px' }} />
              <span className="fs-5 fw-bold">StudentMarket</span>
            </Link>
            <p className="mt-3 text-secondary">
              The ultimate platform for students to buy and sell items within their campus community.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-secondary fs-4"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-secondary fs-4"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-secondary fs-4"><i className="bi bi-twitter"></i></a>
            </div>
          </div>

          {/* Categories */}
          <div className="col-md-3">
            <h5 className="text-uppercase fw-bold">Categories</h5>
            <ul className="list-unstyled mt-3">
              {['Textbooks', 'Electronics', 'Furniture', 'Clothing', 'Services'].map(category => (
                <li key={category} className="mb-2">
                  <Link to={`/category/${category}`} className="text-secondary text-decoration-none">{category}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-md-3">
            <h5 className="text-uppercase fw-bold">Quick Links</h5>
            <ul className="list-unstyled mt-3">
              {['Sell an Item', 'My Wishlist', 'Messages', 'My Profile', 'My Orders'].map(link => (
                <li key={link} className="mb-2">
                  <Link to={`/${link.toLowerCase().replace(/ /g, '-')}`} className="text-secondary text-decoration-none">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="col-md-3">
            <h5 className="text-uppercase fw-bold">Support</h5>
            <ul className="list-unstyled mt-3">
              {['Help Center', 'Safety Tips', 'Terms of Service', 'Privacy Policy', 'Contact Us'].map(support => (
                <li key={support} className="mb-2">
                  <Link to={`/${support.toLowerCase().replace(/ /g, '-')}`} className="text-secondary text-decoration-none">{support}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-secondary mt-5" />
        <p className="text-center text-secondary mt-3">&copy; {new Date().getFullYear()} Student Marketplace. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
