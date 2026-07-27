import { motion } from "framer-motion";
import { Calendar, Users, Ticket, Globe, ShieldCheck, Award, TrendingUp } from "lucide-react";

const stats = [
  {
    label: "Events Hosted",
    value: "1,250+",
    description: "Conferences, workshops, and festivals worldwide",
    icon: Calendar,
    color: "from-indigo-500 to-blue-600",
    lightBg: "bg-indigo-50 dark:bg-indigo-950/60",
    borderColor: "border-indigo-100 dark:border-indigo-800/80",
    textColor: "text-indigo-600 dark:text-indigo-400"
  },
  {
    label: "Active Community",
    value: "45,000+",
    description: "Registered attendees engaging across events",
    icon: Users,
    color: "from-emerald-500 to-teal-600",
    lightBg: "bg-emerald-50 dark:bg-emerald-950/60",
    borderColor: "border-emerald-100 dark:border-emerald-800/80",
    textColor: "text-emerald-600 dark:text-emerald-400"
  },
  {
    label: "Tickets Issued",
    value: "120,000+",
    description: "Seamless QR check-in passes delivered",
    icon: Ticket,
    color: "from-purple-500 to-pink-600",
    lightBg: "bg-purple-50 dark:bg-purple-950/60",
    borderColor: "border-purple-100 dark:border-purple-800/80",
    textColor: "text-purple-600 dark:text-purple-400"
  },
  {
    label: "Countries Reached",
    value: "35+",
    description: "International destinations and virtual hubs",
    icon: Globe,
    color: "from-rose-500 to-orange-500",
    lightBg: "bg-rose-50 dark:bg-rose-950/60",
    borderColor: "border-rose-100 dark:border-rose-800/80",
    textColor: "text-rose-600 dark:text-rose-400"
  },
  {
    label: "Verified Organizers",
    value: "150+",
    description: "Trusted partners with 4.9+ rating averages",
    icon: ShieldCheck,
    color: "from-amber-500 to-yellow-600",
    lightBg: "bg-amber-50 dark:bg-amber-950/60",
    borderColor: "border-amber-100 dark:border-amber-800/80",
    textColor: "text-amber-600 dark:text-amber-400"
  },
  {
    label: "Platform Uptime",
    value: "99.8%",
    description: "Reliable ticketing infrastructure uptime",
    icon: Award,
    color: "from-blue-500 to-cyan-600",
    lightBg: "bg-blue-50 dark:bg-blue-950/60",
    borderColor: "border-blue-100 dark:border-blue-800/80",
    textColor: "text-blue-600 dark:text-blue-400"
  },
];

export default function StatisticsSection() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      {/* Background Soft Glow Accents */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide">
            <TrendingUp className="h-3.5 w-3.5 text-indigo-500" />
            Global Reach & Impact
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Trusted by Thousands Globally
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Empowering event creators and attendees with seamless discovery,<br/> instant ticketing, and real-time community engagement.
          </p><br/>
        </div>

        {/* Spacious 3-Column Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
                className="group relative p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  
                  {/* Top Row: Icon Container & Badge Tag */}
                  <div className="flex items-center justify-between">
                    <div className={`p-4 rounded-2xl border ${item.lightBg} ${item.borderColor} ${item.textColor} transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className="h-6 w-6" />
                    </div>

                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      Verified
                    </span>
                  </div>

                  {/* Stat Value */}
                  <div className="space-y-2">
                    <div className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                      {item.value}
                    </div>

                    {/* Stat Label */}
                    <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
                      {item.label}
                    </div>
                  </div>

                </div>

                {/* Subtitle / Description text with proper spacing */}
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80">
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}