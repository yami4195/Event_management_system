import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import "./HomePage.css";

/* ── Static data ─────────────────────────────── */
const FEATURED_EVENTS = [
  {
    id: 1,
    tag: "Technology",
    tagColor: "#6c63ff",
    title: "Global Dev Summit 2025",
    date: "Aug 12, 2025",
    location: "San Francisco, CA",
    attendees: 1240,
    price: "Free",
    gradient: "linear-gradient(135deg, #6c63ff22, #c084fc22)",
    emoji: "💻",
  },
  {
    id: 2,
    tag: "Music",
    tagColor: "#ff6584",
    title: "Neon Beats Festival",
    date: "Sep 3, 2025",
    location: "Miami, FL",
    attendees: 8500,
    price: "$49",
    gradient: "linear-gradient(135deg, #ff658422, #f9731622)",
    emoji: "🎶",
  },
  {
    id: 3,
    tag: "Business",
    tagColor: "#43e97b",
    title: "Startup World Congress",
    date: "Oct 18, 2025",
    location: "New York, NY",
    attendees: 3200,
    price: "$120",
    gradient: "linear-gradient(135deg, #43e97b22, #38f9d722)",
    emoji: "🚀",
  },
];

const STATS = [
  { value: "50K+", label: "Events Hosted" },
  { value: "2M+", label: "Happy Attendees" },
  { value: "120+", label: "Countries" },
  { value: "98%", label: "Satisfaction Rate" },
];

const CATEGORIES = [
  { emoji: "💻", name: "Technology", count: "1,240 events" },
  { emoji: "🎵", name: "Music", count: "890 events" },
  { emoji: "🎨", name: "Arts & Culture", count: "560 events" },
  { emoji: "🏃", name: "Sports", count: "730 events" },
  { emoji: "🍽️", name: "Food & Drink", count: "420 events" },
  { emoji: "💼", name: "Business", count: "980 events" },
];

const STEPS = [
  {
    step: "01",
    title: "Discover Events",
    desc: "Browse thousands of events by category, location, or date. Find exactly what excites you.",
    icon: "🔍",
  },
  {
    step: "02",
    title: "Register in Seconds",
    desc: "One-click registration. Get your ticket instantly with a QR code sent to your email.",
    icon: "⚡",
  },
  {
    step: "03",
    title: "Attend & Enjoy",
    desc: "Show up, scan your code, and dive into an unforgettable experience.",
    icon: "🎉",
  },
];

/* ── Component ───────────────────────────────── */
const HomePage = () => {
  return (
    <div className="home">
      <Navbar />

      {/* ── HERO ─────────────────────────────── */}
      <section className="hero" id="hero">
        {/* Animated background blobs */}
        <div className="hero__blob hero__blob--1" />
        <div className="hero__blob hero__blob--2" />
        <div className="hero__blob hero__blob--3" />

        <div className="hero__content">
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            New · 50,000+ events live right now
          </div>

          <h1 className="hero__title">
            Discover & Host
            <br />
            <span className="hero__title-gradient">Unforgettable Events</span>
          </h1>

          <p className="hero__subtitle">
            The ultimate platform to find, register, and manage events — from intimate
            workshops to massive festivals. Your next great experience starts here.
          </p>

          <div className="hero__actions">
            <Link to="/events" id="hero-browse-btn" className="btn btn--primary btn--lg">
              Browse Events
              <span className="btn__arrow">→</span>
            </Link>
            <Link to="/register" id="hero-host-btn" className="btn btn--ghost btn--lg">
              Host an Event
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hero__search">
            <div className="hero__search-inner">
              <span className="hero__search-icon">🔍</span>
              <input
                id="hero-search-input"
                type="text"
                className="hero__search-input"
                placeholder="Search events, artists, venues..."
              />
              <button id="hero-search-btn" className="hero__search-btn">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────── */}
      <section className="stats">
        <div className="container">
          {STATS.map((s) => (
            <div className="stats__item" key={s.label}>
              <span className="stats__value">{s.value}</span>
              <span className="stats__label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED EVENTS ──────────────────── */}
      <section className="section featured" id="featured">
        <div className="container">
          <div className="section__header">
            <span className="section__tag">Featured</span>
            <h2 className="section__title">Trending Events</h2>
            <p className="section__subtitle">
              Hand-picked experiences you won't want to miss
            </p>
          </div>

          <div className="events-grid">
            {FEATURED_EVENTS.map((event) => (
              <div
                className="event-card"
                key={event.id}
                style={{ background: event.gradient }}
                id={`event-card-${event.id}`}
              >
                <div className="event-card__top">
                  <span
                    className="event-card__tag"
                    style={{ color: event.tagColor, borderColor: event.tagColor + "44", background: event.tagColor + "15" }}
                  >
                    {event.tag}
                  </span>
                  <span className="event-card__emoji">{event.emoji}</span>
                </div>

                <h3 className="event-card__title">{event.title}</h3>

                <div className="event-card__meta">
                  <span>📅 {event.date}</span>
                  <span>📍 {event.location}</span>
                  <span>👥 {event.attendees.toLocaleString()} attending</span>
                </div>

                <div className="event-card__footer">
                  <span className="event-card__price">{event.price}</span>
                  <Link
                    to={`/events/${event.id}`}
                    className="event-card__btn"
                    id={`event-details-${event.id}`}
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="section__cta">
            <Link to="/events" id="view-all-events-btn" className="btn btn--outline">
              View All Events →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────── */}
      <section className="section categories" id="categories">
        <div className="container">
          <div className="section__header">
            <span className="section__tag">Explore</span>
            <h2 className="section__title">Browse by Category</h2>
          </div>

          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <Link
                to="/events"
                className="category-card"
                key={cat.name}
                id={`category-${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <span className="category-card__emoji">{cat.emoji}</span>
                <span className="category-card__name">{cat.name}</span>
                <span className="category-card__count">{cat.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────── */}
      <section className="section how-it-works" id="how-it-works">
        <div className="container">
          <div className="section__header">
            <span className="section__tag">Simple</span>
            <h2 className="section__title">How It Works</h2>
            <p className="section__subtitle">
              From discovery to the event door in three easy steps
            </p>
          </div>

          <div className="steps-grid">
            {STEPS.map((item, i) => (
              <div className="step-card" key={item.step}>
                <div className="step-card__number">{item.step}</div>
                <div className="step-card__icon">{item.icon}</div>
                <h3 className="step-card__title">{item.title}</h3>
                <p className="step-card__desc">{item.desc}</p>
                {i < STEPS.length - 1 && <div className="step-card__connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────── */}
      <section className="cta-banner" id="cta-banner">
        <div className="cta-banner__glow" />
        <div className="container cta-banner__inner">
          <h2 className="cta-banner__title">
            Ready to create your own event?
          </h2>
          <p className="cta-banner__subtitle">
            Join 10,000+ organizers who trust EventFlow to run world-class events.
          </p>
          <Link to="/register" id="cta-get-started-btn" className="btn btn--primary btn--lg">
            Get Started — It's Free ✨
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────── */}
      <Footer />
    </div>
  );
};

export default HomePage;
