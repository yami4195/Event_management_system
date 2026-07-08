import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    if (menuOpen) {
      const timeoutId = window.setTimeout(() => {
        setMenuOpen(false);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }
  }, [location.pathname, menuOpen]);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Events", to: "/events" },
    { label: "Dashboard", to: "/dashboard" },
  ];

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">⚡</span>
          <span className="navbar__logo-text">EventFlow</span>
        </Link>

        {/* Desktop Links */}
        <ul className="navbar__links">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`navbar__link ${location.pathname === link.to ? "navbar__link--active" : ""}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA Buttons */}
        <div className="navbar__actions">
          <Link to="/login" className="navbar__btn navbar__btn--ghost">
            Log In
          </Link>
          <Link to="/register" className="navbar__btn navbar__btn--primary">
            Get Started
          </Link>
        </div>

        {/* Hamburger */}
        <button
          id="navbar-menu-toggle"
          className={`navbar__hamburger ${menuOpen ? "navbar__hamburger--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${menuOpen ? "navbar__mobile--open" : ""}`}>
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`navbar__mobile-link ${location.pathname === link.to ? "navbar__mobile-link--active" : ""}`}
          >
            {link.label}
          </Link>
        ))}
        <div className="navbar__mobile-actions">
          <Link to="/login" className="navbar__btn navbar__btn--ghost">Log In</Link>
          <Link to="/register" className="navbar__btn navbar__btn--primary">Get Started</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
