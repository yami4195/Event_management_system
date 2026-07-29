import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CalendarDays, Users, Globe2, Star } from "lucide-react";

/* ── Stat definitions ───────────────────────────────────────────────────── */
const STATS = [
  {
    id: "events",
    Icon: CalendarDays,
    value: 20,
    suffix: "+",
    label: "Events Hosted",
    sublabel: "Across 30+ categories",
    color: "text-indigo-600",
    ring: "ring-indigo-100",
    bg: "bg-indigo-50",
  },
  {
    id: "attendees",
    Icon: Users,
    value: 2,
    suffix: "K+",
    label: "Active Attendees",
    sublabel: "Happy ticket holders",
    color: "text-purple-600",
    ring: "ring-purple-100",
    bg: "bg-purple-50",
  },
  {
    id: "countries",
    Icon: Globe2,
    value: 5,
    suffix: "+",
    label: "Countries Reached",
    sublabel: "Global community",
    color: "text-pink-600",
    ring: "ring-pink-100",
    bg: "bg-pink-50",
  },
  {
    id: "rating",
    Icon: Star,
    value: 4.9,
    suffix: "/5",
    label: "Average Rating",
    sublabel: "From verified attendees",
    color: "text-amber-600",
    ring: "ring-amber-100",
    bg: "bg-amber-50",
    isDecimal: true,
  },
];

/* ── Animated counter hook ─────────────────────────────────────────────── */
function useCounter(target, duration = 1800, isDecimal = false) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  const start = () => {
    if (started.current) return;
    started.current = true;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = isDecimal
        ? parseFloat((eased * target).toFixed(1))
        : Math.floor(eased * target);
      setCount(current);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  return { count, start };
}

/* ── Single stat card ───────────────────────────────────────────────────── */
function StatCard({ stat, inView }) {
  const { count, start } = useCounter(stat.value, 1600, stat.isDecimal);

  useEffect(() => {
    if (inView) start();
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center text-center px-6 py-8"
    >
      {/* Icon bubble */}
      <div
        className={`
          flex items-center justify-center
          w-16 h-16 rounded-2xl mb-5
          ${stat.bg} ring-1 ${stat.ring}
        `}
      >
        <stat.Icon className={`h-7 w-7 ${stat.color}`} strokeWidth={1.5} />
      </div>

      {/* Animated number */}
      <p className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none mb-1 tabular-nums">
        {count}
        <span className={`text-3xl sm:text-4xl font-bold ${stat.color}`}>
          {stat.suffix}
        </span>
      </p>

      {/* Label */}
      <p className="text-base sm:text-lg font-bold text-slate-900 mt-3 mb-1">
        {stat.label}
      </p>
      <p className="text-sm text-slate-600">{stat.sublabel}</p>
    </motion.div>
  );
}

/* ── Section ────────────────────────────────────────────────────────────── */
export default function StatisticsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="w-full min-h-screen bg-white"
      aria-labelledby="stats-heading"
    >
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        {/* Section label + heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center mb-14 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-700 mb-4">
            <CalendarDays className="h-3.5 w-3.5 text-indigo-500" />
            By the numbers
          </div>
          <h2
            id="stats-heading"
            className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-slate-900"
          >
            Trusted by thousands
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-600 bg-clip-text text-transparent">
              around the world
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-slate-600">
            Every number represents a real event, a real attendee, and a real
            unforgettable moment.
          </p>
        </motion.div>

        {/* Stat cards grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" }}
              className="rounded-3xl border border-slate-200 bg-slate-50/80 p-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <StatCard stat={stat} inView={inView} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
