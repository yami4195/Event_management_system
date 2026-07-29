import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Send,
  CheckCircle2,
  Phone,
  MapPin,
} from "lucide-react";
import "@/styles/components/Footer.css";

// Clean SVG components for Social Icons
function FacebookIcon() {
  return (
    <svg className="footer-social-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="footer-social-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="footer-social-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg className="footer-social-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.762-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className="footer-social-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const handleQuickLinkClick = (e, target) => {
    if (target.startsWith("/#")) {
      const hash = target.replace("/", "");
      const element = document.querySelector(hash);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", hash);
      }
    }
  };

  const quickLinks = [
    { label: "Home", to: "/#hero-section" },
    { label: "Events", to: "/#events-section" },
    { label: "Categories", to: "/#categories-section" },
    { label: "About", to: "/#about-section" },
    { label: "FAQ", to: "/#faq-section" },
    { label: "Contact", to: "/#contact-section" },
  ];

  const resourceLinks = [
    { label: "Help Center", to: "#" },
    { label: "Privacy Policy", to: "#" },
    { label: "Terms of Service", to: "#" },
    { label: "Organizer Guide", to: "#" },
    { label: "Support", to: "#" },
  ];

  const socialLinks = [
    { component: FacebookIcon, label: "Facebook", href: "https://www.facebook.com/yamlak.sisay.10" },
    { component: TwitterIcon, label: "X (Twitter)", href: "https://x.com/beba_tube?t=u5evqMfK0teBRb6jsqYw4A&s=09" },
    { component: InstagramIcon, label: "Instagram", href: "https://instagram.com" },
    { component: LinkedinIcon, label: "LinkedIn", href: "https://www.linkedin.com/in/yeamlak-sisay-170baa35b?utm_source=share_via&utm_content=profile&utm_medium=member_android" },
    { component: GithubIcon, label: "GitHub", href: "https://github.com/yami4195" },
  ];

  return (
    <footer className="site-footer" id="site-footer">
      <div className="footer-container">
        {/* Newsletter Subscription Bar */}
        <section className="footer-newsletter" aria-labelledby="newsletter-heading">
          <div className="footer-newsletter-wrapper">
            <div className="footer-newsletter-info">
              <h3 id="newsletter-heading" className="footer-newsletter-title">
                Stay Updated
              </h3>
              <p className="footer-newsletter-subtitle">
                Receive updates about upcoming events and new features.
              </p>
            </div>

            <div className="footer-newsletter-form-container">
              <form onSubmit={handleSubscribe} className="footer-newsletter-form">
                <div className="footer-input-wrapper">
                  <input
                    type="email"
                    required
                    aria-label="Email address for newsletter"
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="footer-newsletter-input"
                  />
                  <Mail className="footer-input-icon" aria-hidden="true" />
                </div>
                <button type="submit" className="footer-subscribe-btn">
                  <span>Subscribe</span>
                  <Send className="w-4 h-4" aria-hidden="true" />
                </button>
              </form>

              {subscribed && (
                <div className="footer-newsletter-success" role="status">
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  <span>Thanks for subscribing! Check your inbox soon.</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main 4-Column Navigation Layout */}
        <div className="footer-grid">
          {/* Column 1 - Brand & Social */}
          <div className="footer-brand">
            <Link to="/" className="footer-brand-logo">
              <div className="footer-logo-badge" aria-hidden="true">
                EF
              </div>
              <span className="footer-brand-name">EventFlow</span>
            </Link>

            <p className="footer-brand-desc">
              Discover, create, and manage amazing events with ease. Connecting organizers and attendees through one modern platform.
            </p>

            <div className="footer-socials" aria-label="Social media links">
              {socialLinks.map(({ component: SocialComp, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  aria-label={label}
                  title={label}
                >
                  <SocialComp />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <nav aria-label="Quick links">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-nav-list">
              {quickLinks.map(({ label, to }) => (
                <li key={label}>
                  <a
                    href={to}
                    onClick={(e) => handleQuickLinkClick(e, to)}
                    className="footer-nav-link"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3 - Resources */}
          <nav aria-label="Resources">
            <h4 className="footer-col-title">Resources</h4>
            <ul className="footer-nav-list">
              {resourceLinks.map(({ label, to }) => (
                <li key={label}>
                  <a href={to} className="footer-nav-link">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 4 - Contact Info */}
          <div>
            <h4 className="footer-col-title">Contact</h4>
            <p className="footer-contact-prompt">
              Have questions? We&apos;d love to hear from you.
            </p>

            <address className="footer-contact-address">
              <div className="footer-contact-item">
                <div className="footer-contact-icon-box" aria-hidden="true">
                  <Mail className="footer-contact-icon" />
                </div>
                <a href="mailto:yamlaksisay419@gmail.com" className="footer-contact-link">
                  yamlaksisay419@gmail.com
                </a>
              </div>

              <div className="footer-contact-item">
                <div className="footer-contact-icon-box" aria-hidden="true">
                  <Phone className="footer-contact-icon" />
                </div>
                <a href="tel:+2519-39208663" className="footer-contact-link">
                  +2519-39208663
                </a>
              </div>

              <div className="footer-contact-item">
                <div className="footer-contact-icon-box" aria-hidden="true">
                  <MapPin className="footer-contact-icon" />
                </div>
                <span>Ras gobena damtew Avenue, Stadium Addis Ababa, Ethiopia</span>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} EventFlow. All rights reserved.
          </p>

          <div className="footer-legal-links">
            <a href="#" className="footer-legal-link">
              Privacy
            </a>
            <a href="#" className="footer-legal-link">
              Terms
            </a>
            <a href="#" className="footer-legal-link">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}