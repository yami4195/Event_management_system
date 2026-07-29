import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Plus, Minus } from "lucide-react";
import "@/styles/components/FAQ.css";

const faqs = [
  {
    q: "How do I register for an event?",
    a: "Browsing and registering for events is simple! Select your desired event from our catalog, choose your ticket tier, and click 'Register'. Once completed, your ticket with a QR code will be generated instantly.",
  },
  {
    q: "Can I cancel my registration?",
    a: "Yes, you can cancel your registration at any time from your account dashboard under 'My Registrations'. Depending on the organizer's refund policy, refunds are processed automatically back to your original payment method.",
  },
  {
    q: "How do I become an organizer?",
    a: "To host events, simply sign up or navigate to your profile settings and request an Organizer account. Once approved, you can create events, manage ticketing, view real-time analytics, and check in attendees.",
  },
  {
    q: "Are events free or paid?",
    a: "We support both free and paid events! Event organizers specify ticket prices, and for paid events, transactions are securely processed using industry-standard encrypted payment gateways.",
  },
  {
    q: "Will I receive a confirmation email?",
    a: "Yes! Immediately after registering for an event, a confirmation email containing your event details, digital ticket, and QR code check-in pass will be sent directly to your inbox.",
  },
  {
    q: "Can I see my upcoming registrations?",
    a: "Absolutely. All your active ticket passes, venue maps, and event schedules are organized neatly in your 'My Registrations' dashboard, accessible whenever you log in.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="faq-section" id="faq-section">
      {/* Decorative background gradients */}
      <div className="faq-bg-decoration" aria-hidden="true" />
      <div className="faq-bg-glow-1" aria-hidden="true" />
      <div className="faq-bg-glow-2" aria-hidden="true" />

      <div className="faq-container">
        {/* Centered Section Header */}
        <div className="faq-header">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="faq-badge"
          >
            <HelpCircle className="faq-badge-icon" />
            <span>Got Questions?</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="faq-title"
          >
            Frequently Asked <span className="faq-title-accent">Questions</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="faq-subtitle"
          >
            Find quick answers to the most common questions about discovering, registering for, and managing events.
          </motion.p>
        </div>

        {/* FAQ Accordion List */}
        <div className="faq-list">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const buttonId = `faq-button-${idx}`;
            const panelId = `faq-panel-${idx}`;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className={`faq-card ${isOpen ? "is-open" : ""}`}
              >
                <button
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleAccordion(idx)}
                  className="faq-button"
                  type="button"
                >
                  <div className="faq-button-left">
                    <div className="faq-icon-wrapper" aria-hidden="true">
                      <HelpCircle className="faq-svg-icon" />
                    </div>
                    <span className="faq-question">{faq.q}</span>
                  </div>

                  <div className="faq-toggle-icon" aria-hidden="true">
                    {isOpen ? (
                      <Minus className="faq-svg-icon" />
                    ) : (
                      <Plus className="faq-svg-icon" />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="faq-answer-wrapper"
                    >
                      <div className="faq-answer-inner">
                        <div className="faq-answer-content">
                          <p className="faq-answer-text">{faq.a}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Support Prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="faq-footer"
        >
          <p className="faq-footer-text">
            Still have questions?{" "}
            <a href="#contact" className="faq-footer-link">
              Contact our support team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}