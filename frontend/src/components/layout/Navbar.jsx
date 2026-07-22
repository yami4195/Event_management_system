import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import "./Navbar.css";

const Navbar = () => {
  const MotionLink = motion(Link);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const colors = {
  bg: "#0a0a0f",
  bgLight: "#12121a",
  bgCard: "#1a1a28",
  bgInput: "#151520",
  primary: "#c9a96e",
  primaryHover: "#d4b87a",
  text: "#f0f0f5",
  textMuted: "#8888a0",
  border: "#2a2a3a",
  borderFocus: "#c9a96e",
  success: "#4ade80",
  error: "#f87171",
};

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
    {label: "About us", to: "/about" },
    {label: "Contact", to: "/contact" },
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
        <Link to="/" >
          
          <span style={{ color: colors.primary }}>MeetSphere</span>
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
              <MotionLink to="/login"  whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02, y: -2 }}  style={{
                background: `linear-gradient(135deg, ${colors.primary}, #d4a574)`,
                border: "none", borderRadius: 14, padding: "10px 24px",
                color: colors.bg, fontWeight: 700, fontSize: 16, cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 10,
                boxShadow: "10 8px 24px rgba(201,169,110,0.25)",
                transition: "box-shadow 0.3s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 12px 32px rgba(201,169,110,0.4)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 8px 24px rgba(201,169,110,0.25)"} >
                Log In
              </MotionLink>
              <MotionLink to="/register"   whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02, y: -2 }}  style={{
                background: `linear-gradient(135deg, ${colors.primary}, #d4a574)`,
                border: "none", borderRadius: 14, padding: "10px 20px",
                color: colors.bg, fontWeight: 700, fontSize: 16, cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 10,
                boxShadow: "10 8px 24px rgba(201,169,110,0.25)",
                transition: "box-shadow 0.3s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 12px 32px rgba(201,169,110,0.4)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 8px 24px rgba(201,169,110,0.25)"}>
                Get Started
              </MotionLink>
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
