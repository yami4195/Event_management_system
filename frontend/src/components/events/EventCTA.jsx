import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PlusCircle, UserCheck, Sparkles } from "lucide-react";

export default function EventCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-950 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-indigo-200 text-xs font-semibold tracking-wide">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Host With Us
          </div>

          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Have an Event to Share?
          </h2>

          <p className="text-base sm:text-lg text-indigo-100 max-w-2xl mx-auto leading-relaxed font-normal">
            Reach thousands of eager attendees worldwide. Publish your conference, workshop, concert, or meetup with seamless ticketing and real-time analytics.
          </p>
        </motion.div>

        {/* Action Buttons following Home Page Hierarchy */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          {/* Primary CTA */}
          <Link
            to="/events/create"
            className="inline-flex items-center justify-center gap-3 px-10 h-14 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-base rounded-2xl shadow-xl shadow-blue-600/30 transition-all duration-200"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Create Event</span>
          </Link>

          {/* Secondary CTA */}
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-3 px-10 h-14 border-2 border-white/80 hover:bg-white/10 active:scale-95 text-white font-semibold text-base rounded-2xl transition-all duration-200"
          >
            <UserCheck className="h-5 w-5" />
            <span>Become an Organizer</span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
