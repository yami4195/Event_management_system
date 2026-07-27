import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  { id: 1, name: "Marcus Vance", role: "VP of Engineering at TechCorp", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", rating: 5, review: "EventFlow completely transformed how we organize our annual developer summit. From 1-click ticket checkout to instant QR check-ins at the gate, everything worked flawlessly!" },
  { id: 2, name: "Sophia Rodriguez", role: "Lead Event Coordinator at DesignFest", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", rating: 5, review: "The real-time analytics dashboard gives us complete visibility into ticket sales velocity and attendee check-in times. Highly recommended for modern event organizers!" },
  { id: 3, name: "David Kim", role: "Founder & CEO at StartupHub", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", rating: 5, review: "As an attendee, discovering tech meetups and buying tickets takes seconds. The instant mobile ticket delivery with wallet QR codes is a game changer." },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const current = testimonials[currentIndex];

  return (
    <section className="home-section bg-white dark:bg-slate-900">
      <div className="home-container max-w-5xl">
        <div className="home-section-header--center">
          <span className="home-eyebrow text-indigo-600 dark:text-indigo-400">Testimonials</span>
          <h2 className="home-title text-slate-900 dark:text-slate-100">Loved by Organizers & Attendees</h2>
        </div>

        <div className="relative p-10 sm:p-12 lg:p-16 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <Quote className="absolute top-10 left-10 h-10 w-10 text-indigo-200 dark:text-indigo-900/40 pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-10 relative z-10"
            >
              <img src={current.photo} alt={current.name} className="h-20 w-20 rounded-full object-cover border-2 border-indigo-500 shrink-0 shadow-md" />
              <div className="space-y-6 text-center sm:text-left flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                  &ldquo;{current.review}&rdquo;
                </p>
                <div className="pt-2">
                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{current.name}</h4>
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-1">{current.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${idx === currentIndex ? "w-8 bg-indigo-600" : "w-2.5 bg-slate-300 dark:bg-slate-700"}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)} className="p-3 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)} className="p-3 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
