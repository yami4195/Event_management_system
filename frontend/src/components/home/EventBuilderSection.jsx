import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, X, ShieldCheck } from "lucide-react";
import "@/styles/components/EventBuilder.css";

const UNSPLASH_EVENT_SERVICES =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80";

export default function EventBuilderSection() {
  
  const [serviceView, setServiceView] = useState("Dashboard");

  return (
    <section className="builder-section" id="event-services-section">
      <div className="builder-container">
        <div className="builder-grid">
          {/* Left Column Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="builder-content"
          >
            <h2 className="builder-title">
              Complete Event Management & Ticketing{" "}
              <span className="builder-title-underline">Services</span>
            </h2>

            <p className="builder-subtitle">
              EventFlow provides comprehensive event services: online ticket sales, instant QR code check-in passes, automated attendee registration, custom event landing pages, real-time analytics, and secure payment processing. Everything your event needs in one unified platform.
            </p>

            <ul className="builder-checklist">
              <li className="builder-check-item">
                <Check className="builder-check-icon" />
                <span>Instant Digital Ticketing &amp; QR Code Gate Access</span>
              </li>
              <li className="builder-check-item">
                <Check className="builder-check-icon" />
                <span>Automated Registration, Email Invites &amp; Reminders</span>
              </li>
              <li className="builder-check-item">
                <Check className="builder-check-icon" />
                <span>Real-Time Attendance &amp; Revenue Analytics</span>
              </li>
            </ul>

            <p className="builder-paragraph">
              Whether you&apos;re organizing a conference, workshop, hackathon, concert, seminar, or community meetup, EventFlow gives you everything you need to create, publish, and manage successful events. From event setup and attendee registration to real-time updates and capacity tracking, our platform simplifies every step so you can focus on delivering an unforgettable experience.
            </p>

            <div>
              <Link to="/events" className="builder-btn-primary">
                <span>Explore Platform Services</span>
                <ArrowRight className="builder-btn-icon" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column - Visual Services Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="builder-visual-wrapper"
          >
            <div className="builder-browser-frame">
              {/* macOS Style Window Top Bar */}
              <div className="builder-browser-bar">
                <div className="builder-browser-dots">
                  <span className="builder-dot builder-dot-red" />
                  <span className="builder-dot builder-dot-yellow" />
                  <span className="builder-dot builder-dot-green" />
                </div>
                <div className="builder-browser-url">
                  https://eventflow.com/services/management-dashboard
                </div>
              </div>

              {/* Browser Live Preview Canvas */}
              <div className="builder-canvas">
                <img
                  src={UNSPLASH_EVENT_SERVICES}
                  alt="EventFlow Management Services Preview"
                  className="builder-canvas-image"
                />

                <div className="builder-canvas-overlay">
                  <div className="builder-preview-brand">
                    <span>EventFlow Services</span>
                  </div>

                  <div className="builder-preview-nav">
                    <span>Ticketing</span>
                    <span>QR Check-in</span>
                    <span>Analytics</span>
                  </div>

                  <div className="builder-preview-headline-box">
                    <h3 className="builder-preview-headline">
                      {serviceView === "Dashboard"
                        ? "All-in-One Event Management"
                        : serviceView === "Scanner"
                        ? "Instant QR Gate Check-in"
                        : "Real-Time Revenue Analytics"}
                    </h3>
                  </div>

                  <button className="builder-preview-btn">
                    Launch Event Service
                  </button>
                </div>
              </div>
            </div>


            {/* Corner Badge */}
            <div className="builder-floating-badge" title="24/7 Platform Support">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
