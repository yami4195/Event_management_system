import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Cpu,
  Briefcase,
  Music,
  Trophy,
  BookOpen,
  Palette,
  Heart,
  Users,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    id: "tech",
    name: "Technology & AI",
    count: "42 Events",
    description: "Hackathons, product launches, and dev meetups near you.",
    icon: Cpu,
    color:
      "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
    badge: "Popular",
  },
  {
    id: "business",
    name: "Business & Finance",
    count: "30 Events",
    description: "Investor talks, networking mixers, and startup panels.",
    icon: Briefcase,
    color:
      "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  {
    id: "music",
    name: "Music & Festivals",
    count: "28 Events",
    description: "Live shows, open mics, and weekend festivals.",
    icon: Music,
    color:
      "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800",
  },
  {
    id: "design",
    name: "Design & UX",
    count: "24 Events",
    description: "Portfolio reviews, design sprints, and UX talks.",
    icon: Palette,
    color:
      "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    count: "19 Events",
    description: "Local tournaments, group runs, and fitness classes.",
    icon: Trophy,
    color:
      "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
  {
    id: "education",
    name: "Education & STEM",
    count: "22 Events",
    description: "Workshops, science fairs, and student competitions.",
    icon: BookOpen,
    color:
      "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
  {
    id: "health",
    name: "Health & Wellness",
    count: "15 Events",
    description: "Yoga sessions, mental health talks, and wellness fairs.",
    icon: Heart,
    color:
      "bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800",
  },
  {
    id: "conferences",
    name: "Conferences & Summits",
    count: "35 Events",
    description: "Industry summits, keynote talks, and expos.",
    icon: Users,
    color:
      "bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800",
    badge: "New",
  },
];

export default function CategoriesSection() {
  return (
    <section className="home-section bg-slate-50 dark:bg-slate-950/50">
      <div className="home-container">
        <div className="home-section-header flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="home-eyebrow text-indigo-600 dark:text-indigo-400">
              Explore by Interest
            </span>
            <h2 className="home-title text-slate-900 dark:text-slate-100">
              Featured Event Categories
            </h2>
            <p className="home-desc text-slate-500 dark:text-slate-400 max-w-xl">
              Browse curated categories to find events that match your interests.
            </p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors shrink-0 pb-1"
          >
            View All Categories
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="home-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: idx * 0.06, ease: "easeOut" }}
                className="relative h-full"
              >
                {cat.badge && (
                  <span className="absolute -top-2 -right-2 z-10  bg-indigo-600 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-sm">
                    {cat.badge}
                  </span>
                )}
                <Link
                  to={`/events?category=${cat.id}`}
                  aria-label={`Browse ${cat.name} events, ${cat.count}`}
                  className="home-card block h-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className={`p-4 rounded-2xl border ${cat.color}`}>
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-semibold text-slate-400">
                      {cat.count}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {cat.description}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
