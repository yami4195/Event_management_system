import { motion } from "framer-motion";
import EventCard from "./EventCard";
import { SearchX, RotateCcw } from "lucide-react";

export default function EventsList({ events = [], isLoading, onResetFilters }) {
  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-500">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold">Discovering extraordinary events...</p>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="py-20 px-4 max-w-md mx-auto text-center flex flex-col items-center justify-center space-y-5">
        <div className="h-16 w-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <SearchX className="h-8 w-8" />
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            No events found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            We couldn't find any events matching your selected criteria or search keywords.
          </p>
        </div>

        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm shadow-md transition-all"
          >
            <RotateCcw className="h-4 w-4" />
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((evt, idx) => (
        <motion.div
          key={evt.id || evt.event_id || idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.4, delay: (idx % 6) * 0.06 }}
        >
          <EventCard event={evt} />
        </motion.div>
      ))}
    </div>
  );
}
