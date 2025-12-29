import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import logoImage from '../Photos/Kreslici-platno-1_3@-e1653722976268.webp';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logoImage} alt="Logo" className="logo-image" />
        </Link>
        
        <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/portfolio" 
            className={`navbar-link ${isActive('/portfolio') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Portfolio
          </Link>
          <Link 
            to="/about" 
            className={`navbar-link ${isActive('/about') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About Me
          </Link>
          <Link 
            to="/reels" 
            className={`navbar-link ${isActive('/reels') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Reels
          </Link>
          <Link 
            to="/booking" 
            className={`navbar-link book-now ${isActive('/booking') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Book Now
          </Link>
        </div>

        <button 
          className="navbar-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

