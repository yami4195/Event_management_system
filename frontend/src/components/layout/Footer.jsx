import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">

        <div className="footer__brand">
          <Link to="/" className="footer__logo">
             MeetSphere
          </Link>

          <p>
            Discover, create, and experience extraordinary events worldwide.
          </p>
        </div>


        <div className="footer__links">

          <div>
            <h4>Explore</h4>
            <Link to="/events">Events</Link>
            <Link to="/categories">Categories</Link>
          </div>


          <div>
            <h4>Organizer</h4>
            <Link to="/register">Create Event</Link>
            <Link to="/login">Sign In</Link>
          </div>


          <div>
            <h4>Company</h4>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>

        </div>


        <div className="footer__bottom">
          © {new Date().getFullYear()} EventFlow. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;