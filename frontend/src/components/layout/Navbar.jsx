import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./Navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

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

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Public nav links — always visible
  const publicLinks = [
    { label: "Home", to: "/" },
    { label: "Events", to: "/events" },
  ];

  // Protected nav links — only visible when logged in
  const authLinks = [
    { label: "Dashboard", to: "/dashboard" },
  ];

  const navLinks = isAuthenticated ? [...publicLinks, ...authLinks] : publicLinks;

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

        {/* CTA Buttons — conditional on auth */}
        <div className="navbar__actions">
          {isAuthenticated ? (
            <>
              <span className="navbar__user-greeting">Hi, {user?.firstname}!</span>
              <button onClick={handleLogout} className="navbar__btn navbar__btn--ghost" id="navbar-logout-btn">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__btn navbar__btn--ghost" id="navbar-login-btn">
                Log In
              </Link>
              <Link to="/register" className="navbar__btn navbar__btn--primary" id="navbar-register-btn">
                Get Started
              </Link>
            </>
          )}
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
          {isAuthenticated ? (
            <button onClick={handleLogout} className="navbar__btn navbar__btn--ghost">Log Out</button>
          ) : (
            <>
              <Link to="/login" className="navbar__btn navbar__btn--ghost">Log In</Link>
              <Link to="/register" className="navbar__btn navbar__btn--primary">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
