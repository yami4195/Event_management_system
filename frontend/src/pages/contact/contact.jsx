import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaHeadset,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationCircle,
  FaChevronDown,
  FaUsers,
  FaHandshake,
  FaComments,
  FaStar,
  FaPaperPlane,
  FaRegLifeRing,
  FaBuilding,
  FaSearchLocation,
  FaGithub,
} from "react-icons/fa";
import "./Contact.css";

const CONTACT_INFO_DATA = [
  {
    icon: FaMapMarkerAlt,
    title: "Office Address",
    line1: "Ras Gobena Damtew Avenue, Stadium",
    line2: "Addis Ababa, Ethiopia",
    linkText: "Get Directions",
    linkHref: "#location-section",
  },
  {
    icon: FaEnvelope,
    title: "Email Address",
    line1: "yamlaksisay419@gmail.com",
    line2: "support@eventflow.com",
    linkText: "Send an Email",
    linkHref: "mailto:yamlaksisay419@gmail.com",
  },
  {
    icon: FaPhoneAlt,
    title: "Phone Number",
    line1: "+251 939 208 663",
    line2: "+251 714 578 127",
    linkText: "Call Us Now",
    linkHref: "tel:+251939208663",
  },
  {
    icon: FaClock,
    title: "Business Hours",
    line1: "Mon - Fri: 8:00 AM - 5:00 PM (EAT)",
    line2: "Sat: 10:00 AM - 2:00 PM",
    linkText: "24/7 Online Support",
    linkHref: "#contact-form",
  },
];

const WHY_CONTACT_DATA = [
  {
    icon: FaCheckCircle,
    title: "Event Registration Assistance",
    desc: "Get quick help with ticket claims, event entry passes, or registration troubleshooting.",
  },
  {
    icon: FaUsers,
    title: "Organizer Support & Onboarding",
    desc: "Guidance on creating events, setting up ticket tiers, tracking attendees, and getting verified.",
  },
  {
    icon: FaHandshake,
    title: "Partnership Opportunities",
    desc: "Explore sponsorship, venue partnerships, or co-hosting events with the EventFlow ecosystem.",
  },
  {
    icon: FaHeadset,
    title: "Technical & Platform Support",
    desc: "Report technical glitches, login difficulties, payment issues, or account settings queries.",
  },
  {
    icon: FaBuilding,
    title: "General Inquiries & Quotes",
    desc: "Request custom enterprise solutions, large-scale conference planning, or platform demos.",
  },
  {
    icon: FaComments,
    title: "Feedback & Feature Suggestions",
    desc: "We love hearing from our community! Share your feedback to help us build a better platform.",
  },
];

const FAQ_DATA = [
  {
    question: "How can I register for an event on EventFlow?",
    answer:
      "Browsing and registering for events is simple! Visit our Events page, select your preferred event, and click 'Register Now'. Your ticket will instantly appear in your user profile.",
  },
  {
    question: "How do I become a verified event organizer?",
    answer:
      "Sign up for an organizer account, complete your profile details in the Organizer Dashboard, and submit your organization details for quick verification by our team.",
  },
  {
    question: "How quickly do you respond to support requests?",
    answer:
      "Our support team operates 24/7. General inquiries are answered within 24 hours, while technical and urgent event issues receive priority responses within 6 to 12 hours.",
  },
  {
    question: "Is EventFlow free for event attendees?",
    answer:
      "Yes! Browsing, discovering, and registering for free community events on EventFlow is completely free for all attendees.",
  },
  {
    question: "Can I cancel or update my event registration?",
    answer:
      "Yes, you can manage your registered events anytime from your User Dashboard under 'Registered Events'.",
  },
  {
    question: "How do I report a fraudulent event or issue?",
    answer:
      "You can report any event directly on its detail page or send an email to support@eventflow.com. Our safety team investigates reports immediately.",
  },
];

const CHANNELS_DATA = [
  {
    icon: FaEnvelope,
    title: "Email Support",
    desc: "Send detailed questions or documentation to our dedicated support inbox.",
    actionText: "Send Email",
    actionHref: "mailto:yamlaksisay419@gmail.com",
  },
  {
    icon: FaPhoneAlt,
    title: "Phone Support",
    desc: "Speak directly with our support specialists during business hours.",
    actionText: "Call Support",
    actionHref: "tel:+251939208663",
  },
  {
    icon: FaComments,
    title: "Live Chat Support",
    desc: "Instant real-time assistance right inside your browser.",
    actionText: "Coming Soon",
    actionHref: "#",
    isBadge: true,
  },
  {
    icon: FaGithub,
    title: "Social Media",
    desc: "Connect with us on LinkedIn, Twitter, or GitHub for community updates.",
    actionText: "Follow Us",
    actionHref: "https://github.com/yami4195",
    isExternal: true,
  },
];

const TIMELINE_DATA = [
  {
    time: "< 24 Hrs",
    title: "General Questions",
    desc: "Info about events, platform features, or general inquiries.",
  },
  {
    time: "< 12 Hrs",
    title: "Technical Support",
    desc: "Assistance with account access, form errors, or platform navigation.",
  },
  {
    time: "< 6 Hrs",
    title: "Urgent Event Issues",
    desc: "Live event emergencies, venue changes, or ticketing blocks.",
  },
  {
    time: "< 2 Days",
    title: "Business Partnerships",
    desc: "Corporate sponsorships, enterprise agreements, or media inquiries.",
  },
];

const TESTIMONIALS_DATA = [
  {
    quote:
      "The EventFlow support team helped us resolve a ticketing configuration issue within 30 minutes on a Sunday! Truly exceptional service.",
    name: "Sarah Jenkins",
    role: "Lead Event Coordinator, TechSummit",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
  },
  {
    quote:
      "Fast, courteous, and incredibly reliable. Their organizer support made onboarding our annual conference smooth and hassle-free.",
    name: "Michael Chang",
    role: "Director of Operations, Global DevConf",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
  },
  {
    quote:
      "As an attendee, I had a question about my virtual pass and received a friendly, helpful reply almost instantly. Highly recommend!",
    name: "Amina Kassim",
    role: "Community Lead & Tech Enthusiast",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    rating: 5,
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setSubmitted(true);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      subject: "General Inquiry",
      message: "",
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 6000);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const scrollToForm = (e) => {
    e.preventDefault();
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="contact-page">
      {/* 1. HERO SECTION */}
      <section className="contact-hero">
        <div className="contact-hero-backdrop" />
        <div className="contact-container">
          <div className="contact-hero-grid">
            <div className="contact-hero-content">
              <div className="contact-badge">
                <FaRegLifeRing className="contact-badge-icon" />
                <span>Contact EventFlow</span>
              </div>
              <h1 className="contact-hero-title">
                Let's Get In <span className="contact-title-highlight">Touch</span>
              </h1>
              <p className="contact-hero-subtitle">
                Have questions about an upcoming event, need support with your organizer account, or want to explore partnerships? Our team is always ready to assist you.
              </p>
              <div className="contact-hero-actions">
                <a
                  href="#contact-form"
                  onClick={scrollToForm}
                  className="contact-btn contact-btn-primary"
                >
                  <span>Contact Support</span>
                  <FaPaperPlane />
                </a>
                <Link to="/events" className="contact-btn contact-btn-secondary">
                  <span>Explore Events</span>
                </Link>
              </div>
            </div>

            <div className="contact-hero-media">
              <div className="contact-hero-img-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=1000&q=80"
                  alt="Friendly customer support agent helping client"
                  className="contact-hero-img"
                />
              </div>

              <div className="contact-hero-badge-card">
                <div className="contact-badge-icon-box">
                  <FaHeadset />
                </div>
                <div>
                  <div className="contact-badge-text-title">24/7 Support</div>
                  <div className="contact-badge-text-sub">Always Here to Help</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CONTACT INFORMATION CARDS */}
      <section className="contact-info">
        <div className="contact-container">
          <div className="contact-info-grid">
            {CONTACT_INFO_DATA.map((info, idx) => {
              const IconComp = info.icon;
              return (
                <div key={idx} className="contact-info-card">
                  <div className="contact-info-icon-box">
                    <IconComp />
                  </div>
                  <h3 className="contact-info-title">{info.title}</h3>
                  <p className="contact-info-detail">{info.line1}</p>
                  <p className="contact-info-detail" style={{ marginBottom: "16px" }}>
                    {info.line2}
                  </p>
                  <a href={info.linkHref} className="contact-info-link">
                    {info.linkText} →
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CONTACT FORM */}
      <section className="contact-form-section" id="contact-form" ref={formRef}>
        <div className="contact-container">
          <div className="contact-section-header">
            <div className="contact-badge">
              <span>Send a Message</span>
            </div>
            <h2 className="contact-section-title">
              How Can We <span className="contact-title-highlight">Help You?</span>
            </h2>
            <p className="contact-section-subtitle">
              Fill out the form below and our dedicated support team will respond within 24 hours.
            </p>
          </div>

          <div className="contact-form-wrapper">
            {submitted && (
              <div className="contact-form-success-banner">
                <FaCheckCircle style={{ fontSize: "1.5rem", flexShrink: 0 }} />
                <div>
                  <div className="contact-form-success-title">Message Sent Successfully!</div>
                  <div className="contact-form-success-sub">
                    Thank you for reaching out. A team member will get back to you shortly.
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="contact-form-grid">
                {/* Full Name */}
                <div className="contact-form-group">
                  <label className="contact-form-label" htmlFor="fullName">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={`contact-form-input ${errors.fullName ? "error" : ""}`}
                  />
                  {errors.fullName && (
                    <span className="contact-form-error-msg">
                      <FaExclamationCircle /> {errors.fullName}
                    </span>
                  )}
                </div>

                {/* Email Address */}
                <div className="contact-form-group">
                  <label className="contact-form-label" htmlFor="email">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`contact-form-input ${errors.email ? "error" : ""}`}
                  />
                  {errors.email && (
                    <span className="contact-form-error-msg">
                      <FaExclamationCircle /> {errors.email}
                    </span>
                  )}
                </div>

                {/* Phone Number (Optional) */}
                <div className="contact-form-group">
                  <label className="contact-form-label" htmlFor="phone">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +251 91111111"
                    className="contact-form-input"
                  />
                </div>

                {/* Subject */}
                <div className="contact-form-group">
                  <label className="contact-form-label" htmlFor="subject">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="contact-form-select"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Event Registration">Event Registration</option>
                    <option value="Organizer Support">Organizer Support</option>
                    <option value="Partnership & Sponsorship">Partnership & Sponsorship</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Feedback">Feedback & Suggestions</option>
                  </select>
                </div>

                {/* Message */}
                <div className="contact-form-group full-width">
                  <label className="contact-form-label" htmlFor="message">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    className={`contact-form-textarea ${errors.message ? "error" : ""}`}
                  />
                  {errors.message && (
                    <span className="contact-form-error-msg">
                      <FaExclamationCircle /> {errors.message}
                    </span>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="contact-btn contact-btn-primary contact-form-submit-btn"
                >
                  <span>Send Message</span>
                  <FaPaperPlane />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 4. WHY CONTACT US */}
      <section className="contact-why">
        <div className="contact-container">
          <div className="contact-section-header">
            <div className="contact-badge">
              <span>Why Reach Out</span>
            </div>
            <h2 className="contact-section-title">
              We're Ready to Help with <span className="contact-title-highlight">Any Request</span>
            </h2>
            <p className="contact-section-subtitle">
              Here are common areas where our support team assists attendees and event organizers every day.
            </p>
          </div>

          <div className="contact-why-grid">
            {WHY_CONTACT_DATA.map((reason, i) => {
              const ReasonIcon = reason.icon;
              return (
                <div key={i} className="contact-why-card">
                  <div className="contact-why-icon-box">
                    <ReasonIcon />
                  </div>
                  <h3 className="contact-why-title">{reason.title}</h3>
                  <p className="contact-why-desc">{reason.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      <section className="contact-faq">
        <div className="contact-container">
          <div className="contact-section-header">
            <div className="contact-badge">
              <span>FAQ</span>
            </div>
            <h2 className="contact-section-title">
              Frequently Asked <span className="contact-title-highlight">Questions</span>
            </h2>
            <p className="contact-section-subtitle">
              Quick answers to common questions about contacting support and using EventFlow.
            </p>
          </div>

          <div className="contact-faq-wrapper">
            <div className="contact-faq-list">
              {FAQ_DATA.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className={`contact-faq-item ${isOpen ? "active" : ""}`}>
                    <button
                      className="contact-faq-btn"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <FaChevronDown className="contact-faq-icon" />
                    </button>
                    <div className="contact-faq-content">
                      <p className="contact-faq-answer">{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 6. OFFICE LOCATION */}
      <section className="contact-location" id="location-section">
        <div className="contact-container">
          <div className="contact-section-header">
            <div className="contact-badge">
              <span>Our Office</span>
            </div>
            <h2 className="contact-section-title">
              Visit Our <span className="contact-title-highlight">Headquarters</span>
            </h2>
            <p className="contact-section-subtitle">
              Located in the heart of Addis Ababa, our headquarters is open for partner meetings and consultations.
            </p>
          </div>

          <div className="contact-location-grid">
            <div className="contact-location-map-card">
              <div className="contact-location-map-bg" />
              <div className="contact-location-map-overlay">
                <FaSearchLocation className="contact-location-map-icon" />
                <h3 className="contact-location-map-title">EventFlow HQ</h3>
                <p className="contact-location-map-text">
                  Ras Gobena Damtew Avenue, Stadium Area, Addis Ababa, Ethiopia
                </p>
                <a
                  href="https://maps.google.com/?q=Addis+Ababa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-btn contact-btn-primary"
                  style={{ fontSize: "0.9rem", padding: "10px 20px" }}
                >
                  <FaMapMarkerAlt /> Open in Google Maps
                </a>
              </div>
            </div>

            <div className="contact-location-details">
              <div className="contact-landmark-box">
                <div className="contact-landmark-icon-box">
                  <FaBuilding />
                </div>
                <div>
                  <h4 className="contact-landmark-title">Primary Address</h4>
                  <p className="contact-landmark-desc">
                    Ras Gobena Damtew Avenue, Stadium District, Addis Ababa, Ethiopia
                  </p>
                </div>
              </div>

              <div className="contact-landmark-box">
                <div className="contact-landmark-icon-box">
                  <FaSearchLocation />
                </div>
                <div>
                  <h4 className="contact-landmark-title">Nearby Landmarks</h4>
                  <p className="contact-landmark-desc">
                    Directly adjacent to Addis Ababa National Stadium, 5 minutes walk from Stadium Light Rail Station.
                  </p>
                </div>
              </div>

              <div className="contact-landmark-box">
                <div className="contact-landmark-icon-box">
                  <FaClock />
                </div>
                <div>
                  <h4 className="contact-landmark-title">Visitor Hours</h4>
                  <p className="contact-landmark-desc">
                    Monday to Friday: 8:30 AM – 4:30 PM (EAT). Appointments recommended for partner consultations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. COMMUNICATION CHANNELS */}
      <section className="contact-channels">
        <div className="contact-container">
          <div className="contact-section-header">
            <div className="contact-badge">
              <span>Connect With Us</span>
            </div>
            <h2 className="contact-section-title">
              Multiple Ways to <span className="contact-title-highlight">Connect</span>
            </h2>
            <p className="contact-section-subtitle">
              Choose the channel that best suits your preferred mode of communication.
            </p>
          </div>

          <div className="contact-channels-grid">
            {CHANNELS_DATA.map((ch, i) => {
              const ChIcon = ch.icon;
              return (
                <div key={i} className="contact-channel-card">
                  <div className="contact-channel-icon-box">
                    <ChIcon />
                  </div>
                  <h3 className="contact-channel-title">{ch.title}</h3>
                  <p className="contact-channel-desc">{ch.desc}</p>
                  <a
                    href={ch.actionHref}
                    target={ch.isExternal ? "_blank" : "_self"}
                    rel={ch.isExternal ? "noopener noreferrer" : ""}
                    className={`contact-btn ${
                      ch.isBadge ? "contact-btn-secondary" : "contact-btn-primary"
                    } contact-channel-btn`}
                  >
                    {ch.actionText}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. RESPONSE TIMELINE */}
      <section className="contact-timeline">
        <div className="contact-container">
          <div className="contact-section-header">
            <div className="contact-badge">
              <span>SLA & Response Times</span>
            </div>
            <h2 className="contact-section-title">
              Our Expected <span className="contact-title-highlight">Response Times</span>
            </h2>
            <p className="contact-section-subtitle">
              We value your time. Here is what you can expect when contacting our support channels.
            </p>
          </div>

          <div className="contact-timeline-grid">
            {TIMELINE_DATA.map((tl, index) => (
              <div key={index} className="contact-timeline-card">
                <div className="contact-timeline-time-badge">{tl.time}</div>
                <h3 className="contact-timeline-title">{tl.title}</h3>
                <p className="contact-timeline-desc">{tl.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className="contact-testimonials">
        <div className="contact-container">
          <div className="contact-section-header">
            <div className="contact-badge">
              <span>Support Satisfaction</span>
            </div>
            <h2 className="contact-section-title">
              What Users Say About <span className="contact-title-highlight">Our Support</span>
            </h2>
            <p className="contact-section-subtitle">
              Read feedback from event organizers and attendees who experienced our customer care.
            </p>
          </div>

          <div className="contact-testimonials-grid">
            {TESTIMONIALS_DATA.map((t, idx) => (
              <div key={idx} className="contact-testimonial-card">
                <div className="contact-testimonial-stars">
                  {[...Array(t.rating)].map((_, r) => (
                    <FaStar key={r} />
                  ))}
                </div>
                <p className="contact-testimonial-quote">"{t.quote}"</p>
                <div className="contact-testimonial-author">
                  <img src={t.avatar} alt={t.name} className="contact-testimonial-avatar" />
                  <div>
                    <div className="contact-testimonial-name">{t.name}</div>
                    <div className="contact-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CALL TO ACTION (CTA) */}
      <section className="contact-cta">
        <div className="contact-container">
          <div className="contact-cta-banner">
            <div className="contact-cta-backdrop" />
            <div className="contact-cta-content">
              <h2 className="contact-cta-title">Need Help? We're Here for You.</h2>
              <p className="contact-cta-subtitle">
                Don't hesitate to reach out. Our team is ready to help you discover events, set up organizer tools, or answer any questions.
              </p>
              <div className="contact-cta-actions">
                <a
                  href="#contact-form"
                  onClick={scrollToForm}
                  className="contact-btn contact-btn-light"
                >
                  <span>Send a Message</span>
                  <FaArrowRight />
                </a>
                <Link to="/events" className="contact-btn contact-btn-outline-light">
                  <span>Browse Events</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}