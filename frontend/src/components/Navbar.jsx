import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Detect login state (re-evaluated on each render)
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  let user = null;
  try {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userStr) user = JSON.parse(userStr);
  } catch { /* ignore */ }

  const isLoggedIn = !!token && !!user;

  const getDashboardPath = () => {
    if (!user) return '/customer-dashboard';
    switch (user.role) {
      case 'admin': return '/admin-dashboard';
      case 'staff': return '/staff-dashboard';
      case 'delivery': return '/delivery-dashboard';
      default: return '/customer-dashboard';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setMenuOpen(false); // close mobile menu
    navigate('/signin');
  };

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
            {isLoggedIn ? (
              <>
                <Link to={getDashboardPath()} className="nav-btn nav-btn-signin">
                  {user?.name ? user.name.split(' ')[0] : 'My Account'}
                </Link>
                <button className="nav-btn nav-btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="nav-btn nav-btn-signin">Sign In</Link>
                <Link to="/signup" className="nav-btn nav-btn-start">Get Started</Link>
              </>
            )}
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
            {isLoggedIn ? (
              <>
                <Link to={getDashboardPath()} className="nav-btn nav-btn-signin" onClick={() => setMenuOpen(false)}>
                  {user?.name ? user.name.split(' ')[0] : 'My Account'}
                </Link>
                <button className="nav-btn nav-btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="nav-btn nav-btn-signin" onClick={() => setMenuOpen(false)}>Sign In</Link>
                <Link to="/signup" className="nav-btn nav-btn-start" onClick={() => setMenuOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
