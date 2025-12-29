import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiMail, FiPhone } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">PHOTOGRAPHY</h3>
            <p className="footer-subtitle">Capturing moments, creating memories</p>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <div className="footer-links">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/gallery" className="footer-link">Gallery</Link>
              <Link to="/about" className="footer-link">About</Link>
              <Link to="/booking" className="footer-link">Booking</Link>
            </div>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Contact</h4>
            <div className="footer-contact">
              <a href="mailto:hello@photography.com" className="footer-contact-item">
                <FiMail /> hello@photography.com
              </a>
              <a href="tel:+1234567890" className="footer-contact-item">
                <FiPhone /> +1 (234) 567-890
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-heading">Follow</h4>
            <div className="footer-social">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                <FiInstagram />
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Photography Portfolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

