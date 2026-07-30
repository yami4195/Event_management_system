import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "@/styles/components/Categories.css";

const categories = [
  {
    id: "music",
    name: "Music",
    count: "28 Events",
    cardClass: "category-card--music",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80",
    alt: "Music events and live performances",
  },
  {
    id: "business",
    name: "Business",
    count: "30 Events",
    cardClass: "category-card--business",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
    alt: "Business conferences and networking",
  },
  {
    id: "concerts",
    name: "Concerts",
    count: "35 Events",
    cardClass: "category-card--concerts",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&auto=format&fit=crop&q=80",
    alt: "Live music concerts",
  },
  {
    id: "parties",
    name: "Parties",
    count: "22 Events",
    cardClass: "category-card--parties",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&auto=format&fit=crop&q=80",
    alt: "Parties and celebration events",
  },
  {
    id: "dance",
    name: "Dance",
    count: "18 Events",
    cardClass: "category-card--dance",
    image: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&auto=format&fit=crop&q=80",
    alt: "Dance performances and shows",
  },
  {
    id: "health",
    name: "Health & Wellness",
    count: "15 Events",
    cardClass: "category-card--health",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop&q=80",
    alt: "Health and wellness sessions",
  },
  {
    id: "sports",
    name: "Sports",
    count: "19 Events",
    cardClass: "category-card--sports",
    image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fHNwb3J0fGVufDB8fDB8fHww",
    alt: "Sports tournaments and activities",
  },
  {
    id: "adventure",
    name: "Adventure",
    count: "14 Events",
    cardClass: "category-card--adventure",
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=400&auto=format&fit=crop&q=80",
    alt: "Outdoor adventure activities",
  },
  {
    id: "festivals",
    name: "Festivals",
    count: "25 Events",
    cardClass: "category-card--festivals",
    backdropClass: "backdrop-festivals",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&auto=format&fit=crop&q=80",
    alt: "Cultural and music festivals",
  },
];

export default function CategoriesSection() {
  return (
    <section id="categories-section" className="categories-section">
      <div className="categories-container">
        <div className="categories-header">
          <span className="categories-eyebrow">Explore by Your Interest</span>
          <div className="categories-title-row">
            <div>
              <h2 className="categories-title">Most-Loved Categories</h2>
              <p className="categories-subtitle">
                Browse curated categories to discover upcoming live shows, summits, and experiences near you.
              </p>
            </div>
            <Link to="/events" className="categories-view-all-link">
              View All Categories
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="categories-grid">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: idx * 0.05, ease: "easeOut" }}
            >
              <Link
                to={`/events?category=${cat.id}`}
                className={`category-card ${cat.cardClass}`}
                aria-label={`Browse ${cat.name} events (${cat.count})`}
              >
                <div className="category-card-content">
                  <h3 className="category-card-title">{cat.name}</h3>
                  <span className="category-card-count">{cat.count}</span>
                </div>
                <div className="category-card-media">
                  <div className={`category-backdrop-pill ${cat.backdropClass}`} />
                  <img
                    src={cat.image}
                    alt={cat.alt}
                    className="category-card-img"
                    loading="lazy"
                  />
                </div>
              </Link>
            </motion.div>
          ))}

          {/* 10th Card: View All Categories */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: 9 * 0.05, ease: "easeOut" }}
          >
            <Link
              to="/events"
              className="category-card category-card--view-all"
              aria-label="View all event categories"
            >
              <span className="view-all-subtitle">View All</span>
              <h3 className="view-all-title">
                Categories
                <ArrowRight className="view-all-icon" aria-hidden="true" />
              </h3>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
