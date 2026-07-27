import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircleQuestion, Sparkles } from "lucide-react";

const faqs = [
  {
    q: "How do I register for an event on EventFlow?",
    a: "Simply browse our event catalog, select your desired event, choose your ticket category, and complete checkout. You will receive an instant digital ticket with a unique QR code in your email and mobile dashboard.",
  },
  {
    q: "Can I cancel my registration or request a refund?",
    a: "Yes! You can manage or cancel your registrations directly from your Customer Dashboard under 'My Registrations'. Refund eligibility depends on the specific organizer's policy for that event.",
  },
  {
    q: "How do event organizers create and manage events?",
    a: "Organizers can create an account, navigate to the Admin/Organizer Dashboard, and click 'Create Event'. You can manage ticket tiers, track real-time revenue analytics, and scan attendee QR codes at the gate.",
  },
  {
    q: "Are online payments secure on EventFlow?",
    a: "Absolutely. All transactions are encrypted via 256-bit SSL technology processed through Stripe and PayPal. EventFlow never stores raw credit card details on our servers.",
  },
  {
    q: "How does QR Code gate check-in work?",
    a: "When attendees arrive at the venue, organizers use the EventFlow mobile check-in app or dashboard to scan the attendee's QR code. The system instantly verifies validity and marks the attendee as Checked In.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-slate-50 dark:bg-slate-950 py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Frequently Asked Questions
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-5"
          >
            Got Questions?
            <span className="text-indigo-600 dark:text-indigo-400"> We Have Answers.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed"
          >
            Everything you need to know about registering, payments, and hosting.
          </motion.p>
        </div>

        {/* FAQ Cards */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08, ease: "easeOut" }}
              >
                <div
                  className={`
                    rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden
                    ${isOpen
                      ? "bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-800 shadow-lg shadow-indigo-100/50 dark:shadow-indigo-900/20 ring-1 ring-indigo-100 dark:ring-indigo-900/50"
                      : "bg-white/60 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md hover:shadow-slate-100/50 dark:hover:shadow-black/20"
                    }
                  `}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    className="w-full px-7 py-6 text-left flex items-center justify-between gap-5 group"
                  >
                    <span className="flex items-center gap-4">
                      <div
                        className={`
                          flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-all duration-300
                          ${isOpen
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/40"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/50 group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
                          }
                        `}
                      >
                        <MessageCircleQuestion className="w-5 h-5" />
                      </div>
                      <span
                        className={`
                          font-semibold text-base sm:text-lg transition-colors duration-300
                          ${isOpen ? "text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100"}
                        `}
                      >
                        {faq.q}
                      </span>
                    </span>

                    <div
                      className={`
                        flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-all duration-300
                        ${isOpen
                          ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rotate-180"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/50 group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
                        }
                      `}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="overflow-hidden"
                      >
                        <div className="px-7 pb-7">
                          <div className="ml-14 pl-1 border-l-2 border-indigo-100 dark:border-indigo-900/60">
                            <p className="pl-5 text-slate-600 dark:text-slate-400 leading-relaxed text-[15px]">
                              {faq.a}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            Still have questions?{" "}
            <a
              href="#"
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline transition-colors"
            >
              Contact our support team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}