import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaUsers,
  FaShieldAlt,
  FaLightbulb,
  FaBullseye,
  FaEye,
  FaHandshake,
  FaAward,
  FaChevronDown,
  FaRocket,
  FaStar,
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaArrowRight,
  FaMobileAlt,
  FaBolt,
  FaLock,
  FaCheckCircle,
  FaHeart,
  FaMagic,
} from "react-icons/fa";
import "./About.css";

// Sample Data Structures
const MISSION_VISION_DATA = [
  {
    id: "mission",
    icon: FaBullseye,
    title: "Our Mission",
    desc: "To provide an intuitive, high-performance platform that empowers organizers to create unforgettable event experiences while giving attendees effortless access to events that inspire and connect.",
  },
  {
    id: "vision",
    icon: FaEye,
    title: "Our Vision",
    desc: "To become the global gold standard for event management—where every gathering, large or small, achieves its full potential through modern technology, trust, and community engagement.",
  },
];

const CORE_VALUES_DATA = [
  {
    icon: FaLightbulb,
    title: "Innovation",
    desc: "We continuously evolve our platform with cutting-edge tools, real-time analytics, and seamless interfaces.",
  },
  {
    icon: FaEye,
    title: "Transparency",
    desc: "Open communication, clear event details, and reliable verified organizer reviews for complete peace of mind.",
  },
  {
    icon: FaShieldAlt,
    title: "Reliability",
    desc: "99.9% platform availability, instant ticket confirmation, and robust data protection you can count on.",
  },
  {
    icon: FaHeart,
    title: "Inclusiveness",
    desc: "Welcoming diverse communities, accessible event listings, and intuitive design for every user.",
  },
  {
    icon: FaHandshake,
    title: "Community",
    desc: "Fostering meaningful connections and lasting relationships through shared live experiences.",
  },
  {
    icon: FaAward,
    title: "Excellence",
    desc: "Delivering uncompromised quality in every feature, line of code, and support interaction.",
  },
];

const WHY_CHOOSE_DATA = [
  {
    icon: FaCheckCircle,
    title: "Easy Registration",
    desc: "Frictionless one-click ticket claims and instant entry passes delivered straight to your account.",
  },
  {
    icon: FaLock,
    title: "Secure Platform",
    desc: "Bank-grade data encryption and secure account privacy for all attendees and hosts.",
  },
  {
    icon: FaShieldAlt,
    title: "Verified Organizers",
    desc: "Strict organizer vetting process to guarantee authentic, high-quality event listings.",
  },
  {
    icon: FaRocket,
    title: "Fast Event Discovery",
    desc: "Smart filtering by category, date, location, and topic to find perfect events in seconds.",
  },
  {
    icon: FaMobileAlt,
    title: "Mobile-Friendly",
    desc: "Fully responsive design for flawless navigation on smartphones, tablets, and desktops.",
  },
  {
    icon: FaBolt,
    title: "Real-Time Updates",
    desc: "Instant notifications for schedule updates, venue changes, and live announcements.",
  },
];

const STATS_DATA = [
  { icon: FaUsers, target: 10000, suffix: "+", label: "Active Users" },
  { icon: FaCalendarAlt, target: 500, suffix: "+", label: "Events Hosted" },
  { icon: FaCheckCircle, target: 200, suffix: "+", label: "Verified Organizers" },
  { icon: FaStar, target: 98, suffix: "%", label: "Satisfaction Rate" },
];

const TEAM_DATA = [
  {
    name: "Yeamlak Sisay",
    role: "Lead Frontend Developer",
    bio: "Passionate about building intuitive, responsive UI components and modern web experiences.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    social: { linkedin: "#", twitter: "#", github: "https://github.com/yami4195" },
  },
  {
    name: "Yohannes Zewde",
    role: "Machine Learning Engineer",
    bio: "Focuses on intelligent recommendations and data-driven insights for event discovery.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    social: { linkedin: "#", twitter: "#", github: "#" },
  },
  {
    name: "Mussie Negasi",
    role: "Full-Stack Developer",
    bio: "Expert in building scalable backend services, database design, and web APIs.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    social: { linkedin: "#", twitter: "#", github: "#" },
  },
  {
    name: "Yeabsira Abesha",
    role: "Backend Engineer",
    bio: "Specializes in secure authentication, cloud architecture, and high-performance microservices.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    social: { linkedin: "#", twitter: "#", github: "#" },
  },
];

const FAQ_DATA = [
  {
    question: "How do I register for an event on EventFlow?",
    answer:
      "Simply browse our Events page, click on any event that interests you, and press the 'Register Now' button. Once registered, your entry ticket will be available under your user dashboard.",
  },
  {
    question: "Is EventFlow free for attendees?",
    answer:
      "Yes! Creating an account, browsing events, and registering for free community gatherings on EventFlow is completely free for all users.",
  },
  {
    question: "Can I organize and host my own events?",
    answer:
      "Absolutely. Register as an organizer, head over to your Organizer Dashboard, and click 'Create Event' to configure your event details, ticket limits, schedule, and venue.",
  },
  {
    question: "How do I contact support or an event organizer?",
    answer:
      "You can send us a message anytime via our Contact Us page. For specific event inquiries, you can also click the 'Contact Organizer' option on the event details page.",
  },
  {
    question: "Is my personal data safe on EventFlow?",
    answer:
      "Security is our top priority. EventFlow uses encrypted database connections, secure authentication, and strict privacy protocols to protect your personal information.",
  },
];

export default function About() {
  const [openFaq, setOpenFaq] = useState(0);
  const [animatedStats, setAnimatedStats] = useState(STATS_DATA.map(() => 0));
  const statsRef = useRef(null);
  const hasAnimated = useRef(false);

  // Animated Numbers for Statistics Section when scrolled into view
  useEffect(() => {
    const handleScroll = () => {
      if (!statsRef.current || hasAnimated.current) return;
      const rect = statsRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom >= 0;

      if (inView) {
        hasAnimated.current = true;
        const duration = 2000;
        const steps = 50;
        const intervalTime = duration / steps;

        let stepCount = 0;
        const timer = setInterval(() => {
          stepCount++;
          const progress = stepCount / steps;

          setAnimatedStats(
            STATS_DATA.map((s) => Math.min(s.target, Math.floor(s.target * progress)))
          );

          if (stepCount >= steps) {
            clearInterval(timer);
            setAnimatedStats(STATS_DATA.map((s) => s.target));
          }
        }, intervalTime);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Trigger check on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="about-page">
      {/* 1. HERO SECTION */}
      <section className="about-hero">
        <div className="about-hero-backdrop" />
        <div className="about-container">
          <div className="about-hero-grid">
            <div className="about-hero-content">
              <div className="about-badge">
                <FaMagic className="about-badge-icon" />
                <span>About EventFlow</span>
              </div>
              <h1 className="about-hero-title">
                Connecting People Through <span className="about-title-highlight">Amazing Events</span>
              </h1>
              <p className="about-hero-subtitle">
                EventFlow is the all-in-one event management platform empowering organizers to create unforgettable experiences and helping attendees discover events that ignite their passion.
              </p>
              <div className="about-hero-actions">
                <Link to="/events" className="about-btn about-btn-primary">
                  <span>Explore Events</span>
                  <FaArrowRight />
                </Link>
                <Link to="/contact" className="about-btn about-btn-secondary">
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>

            <div className="about-hero-media">
              <div className="about-hero-img-wrapper">
                <img
                  src="https://media.istockphoto.com/id/1486287149/photo/group-of-multiracial-asian-business-participants-casual-chat-after-successful-conference-event.webp?a=1&b=1&s=612x612&w=0&k=20&c=w6LTgtP8zZnJgg9g7jemKYcmAWjv4lxNlPyZ-PjVwkE="
                  alt="People enjoying live conference event"
                  className="about-hero-img"
                />
              </div>

              {/* Floating Stat Badges */}
              <div className="about-hero-badge-card top-left">
                <div className="about-badge-icon-box">
                  <FaUsers />
                </div>
                <div>
                  <div className="about-badge-text-title">10,000+</div>
                  <div className="about-badge-text-sub">Active Attendees</div>
                </div>
              </div>

              <div className="about-hero-badge-card bottom-right">
                <div className="about-badge-icon-box">
                  <FaCalendarAlt />
                </div>
                <div>
                  <div className="about-badge-text-title">500+</div>
                  <div className="about-badge-text-sub">Events Hosted</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHO WE ARE */}
      <section className="about-who">
        <div className="about-container">
          <div className="about-who-grid">
            <div className="about-who-media">
              <div className="about-who-img-frame">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80"
                  alt="Team collaborating on event management platform"
                  className="about-who-img"
                />
              </div>
              <div className="about-who-experience-tag">
                <div className="about-who-exp-num">5+</div>
                <div className="about-who-exp-txt">Years of Excellence</div>
              </div>
            </div>

            <div className="about-who-content">
              <div className="about-badge">
                <span>Who We Are</span>
              </div>
              <h2 className="about-section-title">
                Empowering Event Experiences <span className="about-title-highlight">Worldwide</span>
              </h2>
              <p className="about-who-text">
                EventFlow was founded with a clear mission: to eliminate the hassle of event planning and ticket discovery. We believe that live events—whether corporate summits, tech workshops, music festivals, or local meetups—have the power to inspire communities and foster lifelong connections.
              </p>
              <p className="about-who-text">
                Our intuitive platform provides organizers with real-time management tools, registration tracking, and analytics, while offering attendees a smooth, mobile-friendly discovery experience.
              </p>

              <div className="about-who-highlights">
                <div className="about-who-hl-item">
                  <FaCheckCircle className="about-who-hl-icon" />
                  <span>Easy Event Discovery</span>
                </div>
                <div className="about-who-hl-item">
                  <FaCheckCircle className="about-who-hl-icon" />
                  <span>Instant Ticket Claims</span>
                </div>
                <div className="about-who-hl-item">
                  <FaCheckCircle className="about-who-hl-icon" />
                  <span>Verified Organizers</span>
                </div>
                <div className="about-who-hl-item">
                  <FaCheckCircle className="about-who-hl-icon" />
                  <span>Reliable & Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION */}
      <section className="about-mission-vision">
        <div className="about-container">
          <div className="about-section-header">
            <div className="about-badge">
              <span>Our Purpose</span>
            </div>
            <h2 className="about-section-title">
              Guided by Purpose, Driven by <span className="about-title-highlight">Impact</span>
            </h2>
            <p className="about-section-subtitle">
              We are committed to shaping the future of event management and community building.
            </p>
          </div>

          <div className="about-mv-grid">
            {MISSION_VISION_DATA.map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.id} className="about-mv-card">
                  <div className="about-mv-icon-box">
                    <IconComponent />
                  </div>
                  <h3 className="about-mv-title">{item.title}</h3>
                  <p className="about-mv-desc">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. CORE VALUES */}
      <section className="about-values">
        <div className="about-container">
          <div className="about-section-header">
            <div className="about-badge">
              <span>Core Values</span>
            </div>
            <h2 className="about-section-title">
              The Principles That <span className="about-title-highlight">Define Us</span>
            </h2>
            <p className="about-section-subtitle">
              These fundamental values guide every feature we build and every interaction we have with our community.
            </p>
          </div>

          <div className="about-values-grid">
            {CORE_VALUES_DATA.map((val, idx) => {
              const IconComp = val.icon;
              return (
                <div key={idx} className="about-value-card">
                  <div className="about-value-icon-box">
                    <IconComp />
                  </div>
                  <h3 className="about-value-title">{val.title}</h3>
                  <p className="about-value-desc">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE EVENTFLOW */}
      <section className="about-why">
        <div className="about-container">
          <div className="about-section-header">
            <div className="about-badge">
              <span>Why Choose Us</span>
            </div>
            <h2 className="about-section-title">
              Everything You Need for <span className="about-title-highlight">Seamless Events</span>
            </h2>
            <p className="about-section-subtitle">
              Designed for both attendees and organizers with performance, security, and simplicity at heart.
            </p>
          </div>

          <div className="about-why-grid">
            {WHY_CHOOSE_DATA.map((item, index) => {
              const CheckIcon = item.icon;
              return (
                <div key={index} className="about-why-card">
                  <div className="about-why-check-box">
                    <CheckIcon />
                  </div>
                  <div className="about-why-card-content">
                    <h3 className="about-why-card-title">{item.title}</h3>
                    <p className="about-why-card-desc">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. PLATFORM STATISTICS */}
      <section className="about-stats" ref={statsRef}>
        <div className="about-stats-backdrop" />
        <div className="about-container">
          <div className="about-stats-grid">
            {STATS_DATA.map((st, i) => {
              const StatIcon = st.icon;
              const formattedValue = animatedStats[i].toLocaleString();
              return (
                <div key={i} className="about-stat-card">
                  <StatIcon className="about-stat-icon" />
                  <div className="about-stat-number">
                    {formattedValue}
                    {st.suffix}
                  </div>
                  <div className="about-stat-label">{st.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. MEET OUR TEAM */}
      <section className="about-team">
        <div className="about-container">
          <div className="about-section-header">
            <div className="about-badge">
              <span>Our Leadership</span>
            </div>
            <h2 className="about-section-title">
              Meet the Minds Behind <span className="about-title-highlight">EventFlow</span>
            </h2>
            <p className="about-section-subtitle">
              A dedicated team of passionate engineers and creators building the next generation of event management solutions.
            </p>
          </div>

          <div className="about-team-grid">
            {TEAM_DATA.map((member, idx) => (
              <div key={idx} className="about-team-card">
                <div className="about-team-photo-wrapper">
                  <img src={member.image} alt={member.name} className="about-team-photo" />
                </div>
                <h3 className="about-team-name">{member.name}</h3>
                <div className="about-team-role">{member.role}</div>
                <p className="about-team-bio">{member.bio}</p>
                <div className="about-team-socials">
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-team-social-link"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin />
                  </a>
                  <a
                    href={member.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-team-social-link"
                    aria-label="Twitter"
                  >
                    <FaTwitter />
                  </a>
                  <a
                    href={member.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-team-social-link"
                    aria-label="GitHub"
                  >
                    <FaGithub />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FREQUENTLY ASKED QUESTIONS */}
      <section className="about-faq">
        <div className="about-container">
          <div className="about-section-header">
            <div className="about-badge">
              <span>FAQ</span>
            </div>
            <h2 className="about-section-title">
              Frequently Asked <span className="about-title-highlight">Questions</span>
            </h2>
            <p className="about-section-subtitle">
              Have questions about EventFlow? Find answers to the most common queries below.
            </p>
          </div>

          <div className="about-faq-container">
            <div className="about-faq-list">
              {FAQ_DATA.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={index} className={`about-faq-item ${isOpen ? "active" : ""}`}>
                    <button
                      className="about-faq-btn"
                      onClick={() => toggleFaq(index)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <FaChevronDown className="about-faq-icon" />
                    </button>
                    <div className="about-faq-content">
                      <p className="about-faq-answer">{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 11. CALL TO ACTION (CTA) */}
      <section className="about-cta">
        <div className="about-container">
          <div className="about-cta-banner">
            <div className="about-cta-backdrop" />
            <div className="about-cta-content">
              <h2 className="about-cta-title">Ready to Discover Your Next Event?</h2>
              <p className="about-cta-subtitle">
                Join thousands of attendees and event organizers creating and experiencing extraordinary moments on EventFlow.
              </p>
              <div className="about-cta-actions">
                <Link to="/events" className="about-btn about-btn-light">
                  <span>Browse Events</span>
                  <FaArrowRight />
                </Link>
                <Link to="/register" className="about-btn about-btn-outline-light">
                  <span>Become an Organizer</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}