import { motion } from "framer-motion";

const organizers = [
  { name: "TechCorp Labs", logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80" },
  { name: "Global Design Hub", logo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&auto=format&fit=crop&q=80" },
  { name: "FinTech Alliance", logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format&fit=crop&q=80" },
  { name: "Music Fest Network", logo: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80" },
  { name: "SaaS Summit Org", logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80" },
];

export default function TrustedOrganizersSection() {
  return (
    <section className="home-section bg-slate-50 dark:bg-slate-950/50 border-y border-slate-200/60 dark:border-slate-800">
      <div className="home-container">
        <div className="home-section-header--center" style={{ marginBottom: "48px" }}>
          <span className="home-eyebrow text-slate-400">Powering Events for Industry Leaders</span>
        </div>

        <div className="home-grid home-footer-columns grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 items-center">
          {organizers.map((org, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.06, ease: "easeOut" }}
              className="home-card py-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-center gap-4 group"
            >
              <img src={org.logo} alt={org.name} className="h-10 w-10 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{org.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
