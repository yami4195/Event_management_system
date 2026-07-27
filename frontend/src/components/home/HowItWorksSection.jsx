import { motion } from "framer-motion";
import { Search, CreditCard, TicketCheck, PartyPopper } from "lucide-react";

const steps = [
  { step: "01", title: "Discover an Event", description: "Browse thousands of curated summits, concerts, and workshops filtered by topic or location.", icon: Search },
  { step: "02", title: "Register Online", description: "Select your desired ticket tier and complete 1-click payment with instant SSL confirmation.", icon: CreditCard },
  { step: "03", title: "Receive Confirmation", description: "Get your digital pass with unique QR Code delivered directly to your inbox & mobile wallet.", icon: TicketCheck },
  { step: "04", title: "Attend & Enjoy", description: "Scan your QR code at the venue entrance for instant check-in and connect with attendees.", icon: PartyPopper },
];

export default function HowItWorksSection() {
  return (
    <section className="home-section bg-white dark:bg-slate-900">
      <div className="home-container">
        <div className="home-section-header--center">
          <span className="home-eyebrow text-indigo-600 dark:text-indigo-400">Simple 4-Step Process</span>
          <h2 className="home-title text-slate-900 dark:text-slate-100">How EventFlow Works</h2>
          <p className="home-desc text-slate-500 dark:text-slate-400 mx-auto">
            From discovery to check-in, experiencing events has never been smoother.
          </p>
        </div>

        <div className="home-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: idx * 0.08, ease: "easeOut" }}
                className="home-card bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between h-full"
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{item.step}</span>
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{item.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
