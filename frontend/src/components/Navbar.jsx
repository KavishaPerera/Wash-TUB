import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-logo" style={{ textDecoration: 'none' }}>
            <span className="logo-text">
              Wash<span className="gradient-text">Tub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="navbar-menu">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/services" className="nav-link">Services</Link></li>
            <li><Link to="/pricing" className="nav-link">Pricing</Link></li>
            <li><Link to="/about" className="nav-link">About</Link></li>
            <li><Link to="/contact" className="nav-link">Contact</Link></li>
          </ul>

          {/* CTA Buttons */}
          <div className="navbar-actions">
            <Link to="/signin" className="nav-btn nav-btn-signin">Sign In</Link>
            <Link to="/signup" className="nav-btn nav-btn-start">Get Started</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${menuOpen ? 'active' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${menuOpen ? 'mobile-menu-open' : ''}`}>
          <ul className="mobile-menu-list">
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link></li>
            <li><Link to="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link></li>
            <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
            <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
          </ul>
          <div className="mobile-menu-actions">
            <Link to="/signin" className="nav-btn nav-btn-signin" onClick={() => setMenuOpen(false)}>Sign In</Link>
            <Link to="/signup" className="nav-btn nav-btn-start" onClick={() => setMenuOpen(false)}>Get Started</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
