import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  MapPin,
  Calendar,
  Globe,
  Compass,
  ArrowRight,
  Search,
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

export default function EventHero() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      {/* Soft background glow blobs matching Home Page styling */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10 pb-16 lg:pt-14 lg:pb-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* LEFT COLUMN — Main Headline */}
          <motion.div
            {...fadeUp(0)}
            className="lg:col-span-7 space-y-6 sm:space-y-8 text-left"
          >
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 text-slate-700 dark:text-slate-300 text-xs font-semibold tracking-wide">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              International Event Discovery Platform
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
                Discover Amazing Events
              </h1>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] bg-gradient-to-r from-indigo-600 via-blue-600 to-amber-500 dark:from-indigo-400 dark:via-blue-300 dark:to-pink-400 bg-clip-text text-transparent mt-2">
                Everywhere, Every Day
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Explore global tech summits, hands-on design masterclasses, live
              music festivals, business expos, and local meetups. Connect with
              passionate communities worldwide.
            </p>

            {/* CTAs — replaces the old duplicate search bar with real actions */}
            <motion.div
              {...fadeUp(0.1)}
              className="flex flex-wrap items-center gap-3 pt-1"
            >
              <a
                href="#events-results"
                className="inline-flex items-center justify-center gap-2 px-6 h-12 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm sm:text-base rounded-xl sm:rounded-2xl shadow-lg shadow-blue-600/25 transition-all duration-200"
              >
                <Search className="h-4 w-4" />
                <span>Browse all events</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/events/create"
                className="inline-flex items-center justify-center gap-2 px-6 h-12 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-700 dark:text-slate-200 font-semibold text-sm sm:text-base rounded-xl sm:rounded-2xl transition-all duration-200"
              >
                Host an event
              </Link>
            </motion.div>

            {/* Feature pills */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>50+ Countries</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Real-Time Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-amber-500" />
                <span>Verified Organizers</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN — Dynamic Event Hero Visual Card */}
          <motion.div
            {...fadeUp(0.15)}
            className="lg:col-span-5 relative mt-4 lg:mt-0"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 group">
                <div className="h-64 sm:h-72 w-full overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80"
                    alt="International Event Hero"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 dark:bg-slate-900/95 text-indigo-600 dark:text-indigo-400 backdrop-blur-md shadow">
                    Featured Global Event
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" /> AUG 15 - 18, 2026
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-rose-500" /> San Francisco, CA
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                    Global Tech & Developer Summit 2026
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                    Keynote addresses, networking lounges, and developer
                    sessions hosted by international industry pioneers.
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>Organized by Sarah Chen</span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900">
                      412 / 500 Attending
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Stat Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute -bottom-6 -left-6 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xl hidden sm:flex items-center gap-4 z-20"
              >
                <div className="h-12 w-12 rounded-xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-400/20 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                  ⚡
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900 dark:text-white">100% Verified</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Authentic Event Tickets</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
