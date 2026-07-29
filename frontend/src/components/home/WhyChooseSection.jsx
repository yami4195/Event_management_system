import { motion } from "framer-motion";
import { UserCheck, ShieldCheck, QrCode, Bell, BarChart3, Megaphone,} from "lucide-react";
const features = [
  { icon: UserCheck, title: "Easy Registration", description: "Seamless 1-click registration for attendees with instant digital tickets & calendar sync.", color: "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800" },
  { icon: ShieldCheck, title: "Secure Payments", description: "Enterprise SSL encryption with instant automated payouts and multi-currency support.", color: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
  { icon: QrCode, title: "QR Code Check-in", description: "Instant mobile QR scanning at event entrances for zero queue check-in speed.", color: "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800" },
  { icon: Bell, title: "Real-time Notifications", description: "Automated SMS, Email, and Push alerts for schedule changes, tickets, and reminders.", color: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
  { icon: BarChart3, title: "Powerful Analytics", description: "Live dashboard monitoring revenue, ticket velocity, peak check-in hours, and demographics.", color: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
  { icon: Megaphone, title: "Event Promotion", description: "Built-in promotional tools, social sharing integrations, and custom discount coupons.", color: "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800" },
];

export default function WhyChooseSection() {
  return (
    <section id="about-section" className="home-section bg-slate-50 dark:bg-slate-950/50">
      <div className="home-container">
        <div className="home-section-header--center">
          <span className="home-eyebrow text-indigo-600 dark:text-indigo-400">Why EventFlow</span> 
          <h2 className="home-title text-slate-900 dark:text-slate-100">Built for Attendees & Organizers Alike</h2>
          <p className="home-desc text-slate-500 dark:text-slate-400 mx-auto">
            Everything you need to host flawless events and discover unforgettable experiences.
          </p>
        </div>

        <div className="home-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: idx * 0.07, ease: "easeOut" }}
                className="home-card bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg h-full"
              >
                <div className={`p-4 rounded-2xl border ${item.color} inline-block mb-8`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
