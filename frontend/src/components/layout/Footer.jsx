import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">⚡ EventFlow</Link>
          <p>The platform for extraordinary events.</p>
        </div>
        <div className="footer__links">
          <Link to="/events">Browse Events</Link>
          <Link to="/register">Host an Event</Link>
          <Link to="/login">Sign In</Link>
        </div>
        <p className="footer__copy">© {new Date().getFullYear()} EventFlow. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
