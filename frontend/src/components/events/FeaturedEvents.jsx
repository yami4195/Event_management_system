import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import EventCard from "./EventCard";

export default function FeaturedEvents({ featuredEvents = [] }) {
  if (!featuredEvents || featuredEvents.length === 0) return null;

  return (
    <section className="py-16 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-900 text-amber-700 dark:text-amber-300 text-xs font-semibold tracking-wide mb-3">
              <Sparkles className="h-3.5 w-3.5" /> Spotlight Selections
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured International Events
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl mt-2">
              Top hand-picked global conferences, music festivals, and summits with high attendee interest.
            </p>
          </div>
        </div>

        {/* Featured Events Grid using Reusable EventCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredEvents.slice(0, 3).map((evt, idx) => (
            <motion.div
              key={evt.id || evt.event_id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
            >
              <EventCard event={evt} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
