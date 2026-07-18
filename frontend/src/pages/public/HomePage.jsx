import { Link } from "react-router-dom";
import hero from "../../assets/hero.jpg";
import "./HomePage.css";

const HomePage = () => (
  <section
    className="hero"
    style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.65)), url(${hero})`,
    }}
  >
    <div className="hero__content">
      <h1 className="hero__title">
        Discover &amp; Host
        <br />
        <span className="hero__title-gradient">Unforgettable Events</span>
      </h1>

      <p className="hero__subtitle">
        Find, register, and manage events — from intimate workshops to
        massive festivals. Your next great experience starts here.
      </p>

      <div className="hero__actions">
        <Link to="/events" className="hero__btn hero__btn--primary">
          Browse Events →
        </Link>
        
      </div>
    </div>
  </section>
);

export default HomePage;
