import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Clock, ArrowRight, Sparkles } from "lucide-react";

export default function UpcomingTimeline({ timelineItems = [] }) {
  if (!timelineItems || timelineItems.length === 0) return null;

  return (
    <section className="py-16 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Event Roadmap
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Upcoming Events Schedule
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-2">
            Stay ahead of key dates. Plan your attendance for upcoming conferences and gatherings.
          </p>
        </div>

        {/* Timeline Items */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical central line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-0.5 bg-indigo-100 dark:bg-slate-800" />

          <div className="space-y-8 relative">
            {timelineItems.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.1 }}
                  className={`flex flex-col md:flex-row items-center gap-6 ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Event Card Info */}
                  <div className="w-full md:w-1/2">
                    <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 group">
                      
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.badgeColor || "bg-indigo-100 text-indigo-700"}`}>
                          {item.daysAway}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {item.category}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {item.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                          <span>{item.fullDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                          <span>{item.location}</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Central Node Badge */}
                  <div className="shrink-0 z-10 hidden md:flex items-center justify-center h-14 w-14 rounded-2xl bg-indigo-600 text-white font-black text-xs text-center shadow-lg shadow-indigo-600/30 border-4 border-white dark:border-slate-950">
                    {item.date}
                  </div>

                  {/* Empty Spacer */}
                  <div className="hidden md:block w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
