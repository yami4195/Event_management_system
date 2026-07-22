import { Link } from "react-router-dom";
import hero from "../../assets/hero.jpg";
import "./HomePage.css";
import { motion } from "framer-motion";
 const MotionLink = motion(Link);
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

      <div className="hero__subtitle">
        <h4>
          Find, register, and manage events — from intimate workshops to
          massive festivals. Your next great experience starts here.
        </h4>
      </div>

      <div className="hero__actions">
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
                Browse Events
              </MotionLink>
        
      </div>
    </div>
  </section>
);

export default HomePage;
