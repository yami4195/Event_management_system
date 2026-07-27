import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, MapPin, Calendar, ArrowRight } from "lucide-react";

const upcomingEvents = [
  { id: "evt_7", title: "Global FinTech & Web3 Expo 2026", image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&auto=format&fit=crop&q=80", date: "Aug 05, 2026", location: "Chicago, IL", countdown: "03d : 14h : 22m", seatsLeft: 12, price: "$199.00" },
  { id: "evt_8", title: "Cybersecurity & Cloud Defense ", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80", date: "Aug 12, 2026", location: "Boston, MA", countdown: "10d : 08h : 45m", seatsLeft: 6, price: "$250.00" },
  { id: "evt_9", title: "SaaS Growth & Founder Keynote", image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80", date: "Aug 18, 2026", location: "Austin, TX", countdown: "16d : 19h : 10m", seatsLeft: 24, price: "Free" },
];

export default function UpcomingEventsSection() {
  return (
    <section className="home-section bg-slate-50 dark:bg-slate-950/50">
      <div className="home-container">
        <div className="home-section-header flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="home-eyebrow text-rose-600 dark:text-rose-400">Starting Soon</span>
            <h2 className="home-title text-slate-900 dark:text-slate-100">Upcoming Events & Countdowns</h2>
            <p className="home-desc text-slate-500 dark:text-slate-400 max-w-xl">
              Don&apos;t miss these events launching in the next few weeks.
            </p>
          </div>
          <Link to="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 transition-colors shrink-0 pb-1">
            View Calendar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="home-grid grid grid-cols-1 md:grid-cols-3">
          {upcomingEvents.map((evt, idx) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: idx * 0.08, ease: "easeOut" }}
              className="rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-shadow h-full flex flex-col"
            >
              <div className="relative h-56 w-full bg-slate-100 dark:bg-slate-800 shrink-0">
                <img src={evt.image} alt={evt.title} className="h-full w-full object-cover" />
                <div className="absolute top-5 left-5 px-4 py-2 rounded-full bg-rose-600 text-white font-mono font-semibold text-xs flex items-center gap-2 shadow-md">
                  <Clock className="h-3.5 w-3.5" />
                  {evt.countdown}
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">{evt.title}</h3>
                  <div className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-indigo-500 shrink-0" /> {evt.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-indigo-500 shrink-0" /> {evt.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800 mt-auto">
                  <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">Only {evt.seatsLeft} seats left</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{evt.price}</span>
                </div>

                <Link
                  to={`/events/${evt.id}`}
    className="inline-flex items-center justify-center gap-3 px-12 h-14 min-w-[10rem] bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-base shadow-lg shadow-blue-600/20 transition-all duration-200"
                >
                  Book Seat
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
