import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Plus } from "lucide-react";

export default function CTASection() {
  return (
    <section className="home-section relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-indigo-50/40 text-slate-900 py-20 lg:py-28 border-t border-slate-100">
      {/* Background Soft Glow Accents */}
      <div className="absolute top-0 right-1/3 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

      <div className="home-container max-w-4xl relative z-10 text-center space-y-8 px-4 mx-auto">
        {/* Pill Badge */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold tracking-wide shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <h3>Start Building Unforgettable Experiences</h3>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Ready to Host Your Next Event?
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 mx-auto max-w-2xl leading-relaxed">
          Join thousands of event creators using EventFlow to publish events, manage ticket sales, and track real-time attendance effortlessly.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {/* Primary Action Button (Bigger) */}
          <Link
            to="/register"
    className="inline-flex items-center justify-center gap-3 px-12 h-14 min-w-[10rem] bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-base shadow-lg shadow-blue-600/20 transition-all duration-200"
          >
            <Plus className="h-5 w-5 stroke-[2.5]" />
            Create Event
          </Link>

          {/* Secondary Action Button (Bigger) */}
          <Link
            to="/events"
    className="inline-flex items-center justify-center gap-3 px-12 h-14 min-w-[10rem] bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-base shadow-lg shadow-blue-600/20 transition-all duration-200"
          >
            Explore Events
            <ArrowRight className="h-5 w-5 stroke-[2.5] text-indigo-600" />
          </Link>
        </div>
      </div>
    </section>
  );
}