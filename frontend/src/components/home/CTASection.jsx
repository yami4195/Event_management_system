import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Plus, ArrowRight, CheckCircle2 } from "lucide-react";
import "@/styles/components/CTA.css";

export default function CTASection() {
  return (
    <section className="cta-section" id="contact-section">
      {/* Background Soft Radial Glows */}
      <div className="cta-bg-glow-1" aria-hidden="true" />
      <div className="cta-bg-glow-2" aria-hidden="true" />

      <div className="cta-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="cta-card"
        >
          {/* Top Pill Badge */}
          <div className="cta-badge">
            <Sparkles className="cta-badge-icon" />
            <span>Start Building Unforgettable Experiences</span>
          </div>

          {/* Heading */}
          <h2 className="cta-heading">
            Ready to Host Your Next <span className="cta-heading-accent">Unforgettable Event?</span>
          </h2>

          {/* Subtitle */}
          <p className="cta-subtitle">
            Join thousands of event creators using EventFlow to publish events.
          </p>

          {/* Buttons */}
          <div className="cta-actions">
            <Link to="/register" className="cta-btn-primary">
              <Plus className="cta-btn-icon" />
              <span>Create Event</span>
            </Link>

            <Link to="/events" className="cta-btn-secondary">
              <span>Explore Events</span>
              <ArrowRight className="cta-btn-icon" />
            </Link>
          </div>

          {/* Trust Features / Bullets */}
          <div className="cta-features">
            <div className="cta-feature-item">
              <CheckCircle2 className="cta-check-icon" />
              <span>Instant Event Publishing</span>
            </div>
            <div className="cta-feature-item">
              <CheckCircle2 className="cta-check-icon" />
              <span>No Credit Card Required</span>
            </div>
            <div className="cta-feature-item">
              <CheckCircle2 className="cta-check-icon" />
              <span>Free & Paid Tickets</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}