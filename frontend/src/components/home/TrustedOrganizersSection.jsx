import { motion } from "framer-motion";
import { Award } from "lucide-react";
import "@/styles/components/TrustedOrganizers.css";

const organizers = [
  { name: "TechCorp Labs", logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80" },
  { name: "Global Design Hub", logo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&auto=format&fit=crop&q=80" },
  { name: "FinTech Alliance", logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format&fit=crop&q=80" },
  { name: "Music Fest Network", logo: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80" },
  { name: "SaaS Summit Org", logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80" },
];

export default function TrustedOrganizersSection() {
  return (
    <section className="organizers-section" id="organizers-section">
      <div className="organizers-bg-glow" aria-hidden="true" />

      <div className="organizers-container">
        {/* Section Header */}
        <div className="organizers-header">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="organizers-badge"
          >
            <Award className="organizers-badge-icon" />
            <span>Trusted Industry Leaders</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="organizers-title"
          >
            Powering Events for <span className="organizers-title-accent">Top Organizers</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="organizers-subtitle"
          >
            Empowering world-class brands, conferences, and creators to deliver unforgettable experiences.
          </motion.p>
        </div>

        {/* 5-Column Responsive Grid */}
        <div className="organizers-grid">
          {organizers.map((org, idx) => (
            <motion.div
              key={org.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className="organizers-card"
            >
              <img
                src={org.logo}
                alt={`${org.name} logo`}
                className="organizers-logo"
                loading="lazy"
              />
              <span className="organizers-name">{org.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
