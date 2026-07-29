import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import EventCard from "../events/EventCard";
import { eventsService } from "../../services";

export default function UpcomingEventsSection() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const res = await eventsService.getAll({ limit: 6 });
        const data =
          res.data?.data?.events ||
          res.data?.events ||
          res.data?.data ||
          res.data ||
          [];

        if (Array.isArray(data)) {
          setEvents(data);
        }
      } catch (err) {
        console.error("Failed to load events from DB:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="home-section bg-slate-50 dark:bg-slate-950/50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200/60 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold tracking-wide mb-3">
              <Sparkles className="h-3.5 w-3.5" /> Starting Soon
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Upcoming & Available Events
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl mt-2">
              Browse live events from our database and reserve your seat today.
            </p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors shrink-0 pb-1"
          >
            Browse All Events
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-96 rounded-3xl bg-slate-200/60 dark:bg-slate-800/60 animate-pulse border border-slate-200 dark:border-slate-800"
              />
            ))}
          </div>
        ) : events.length > 0 ? (
          /* Events Grid using Reusable EventCard */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {events.map((evt, idx) => (
              <motion.div
                key={evt.id || evt.event_id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: idx * 0.08, ease: "easeOut" }}
              >
                <EventCard event={evt} />
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400 font-medium text-base">
              No events found in the database.
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
            >
              Explore Events Page
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
