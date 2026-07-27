import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  ShieldCheck,
  Sparkles,
Star
} from "lucide-react";

/* ── Unsplash event images ───────────────────────────────────────────────────
   Three distinct event-related photos:
   1. main  — tall concert / festival crowd (dominant left image)
   2. top   — conference / speaker on stage  (stacked top-right)
   3. bot   — outdoor food & culture festival (stacked bottom-right)
   All served via Unsplash's resizing API (w/h + fit=crop + q=80).
──────────────────────────────────────────────────────────────────────────── */
const IMG_MAIN =
  "https://media.istockphoto.com/id/1388162040/photo/a-crowded-concert-hall-with-scene-stage-in-red-lights-rock-show-performance-with-people.webp?a=1&b=1&s=612x612&w=0&k=20&c=4Lu50NpNHcgOPft4lDtofxG4wAIsWlpLfhiQ1226L08=";
const IMG_TOP =
  "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGVjaCUyMGNvbmZlcmVuY2V8ZW58MHx8MHx8fDA%3D";
const IMG_BOT =
  "https://images.unsplash.com/photo-1675716921224-e087a0cca69a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bmV0d29ya2luZyUyMGV2ZW50fGVufDB8fDB8fHww";

/* fade-up variants reused for each column */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

export default function HeroSection() {
  return (
    <section className="home-hero relative overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 transition-colors duration-200">
      {/* Soft glow blobs */}
      <div className="absolute top-0 left-1/4 h-[480px] w-[480px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 h-[480px] w-[480px] rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-3xl pointer-events-none" />

      <div className="home-container relative z-10 w-full pt-6 pb-16 lg:pt-10 lg:pb-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* ── LEFT — text column ─────────────────────────────────────── */}
          <motion.div
            {...fadeUp(0)}
            className="lg:col-span-6 space-y-7 lg:space-y-8 text-left"
          >
            {/* Big top headline */}
            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-slate-900 dark:text-white">
              Discover, Book & Manage 
              </h1>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] bg-gradient-to-r from-indigo-600 via-blue-600 to-yellow-600 dark:from-indigo-400 dark:via-blue-300 dark:to-pink-400 bg-clip-text text-transparent">
              Events with Ease
              </h1>
            </div>
<br/>
            {/* Pill badge */}
            <h3 className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 text-slate-700 dark:text-slate-300 text-xs font-semibold tracking-wide mb-4">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              The Next-Gen Event Management Platform
            </h3><br/><br/>

            {/* Subtitle */}
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-normal">
              Find trending tech summits, music festivals, business expos, and
              workshops near you — or host your own with real-time analytics and
              seamless QR check-ins.
            </p><br/>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1 mb-12">
  <Link
    to="/events"
    className="inline-flex items-center justify-center gap-3 px-12 h-14 min-w-[10rem] bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-base shadow-lg shadow-blue-600/20 transition-all duration-200"
  >
    Explore Events
  </Link>
  <Link
  to="/register"
  className="inline-flex items-center justify-center gap-3 px-12 h-14 min-w-[11rem] border-2 border-blue-600 text-blue-600  hover:text-blue active:scale-95 font-semibold text-base  shadow-lg shadow-blue-600/10 transition-all duration-200"
>
  Become an Organizer
</Link>
</div>
<br/>

            {/* Trust badges */}
            <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm font-medium text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Verified Tickets</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Instant QR Check-in</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>20K+ Attendees</span>
              </div>
            </div><br/>
{/* Social Proof (Ratings) */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-4">
              {[
                { name: 'Capterra', score: '4.7/5', rating: 4.7 },
                { name: 'G2', score: '5/5', rating: 5.0 },
                { name: 'Google', score: '4.7/5', rating: 4.7 },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col space-y-1">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {item.name} {item.score}
                  </div>
                  <div className="flex items-center space-x-0.5">
                    {[0, 1, 2, 3, 4].map((starIndex) => {
                      const fillPercentage = Math.min(Math.max(item.rating - starIndex, 0), 1) * 100;
                      return (
                        <div key={starIndex} className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0">
                          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500/20 fill-amber-500/20" />
                          <div
                            className="absolute top-0 left-0 overflow-hidden"
                            style={{ width: `${fillPercentage}%` }}
                          >
                            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-500" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </motion.div>
            
          

          {/* ── RIGHT — 3-image mosaic ─────────────────────────────────── */}
          <motion.div
            {...fadeUp(0.15)}
            className="lg:col-span-6 relative mt-4 lg:mt-0"
          >
           <div className="grid grid-cols-2 grid-rows-[1.2fr_1fr] gap-3 h-[560px]">

  {/* Top Full-Width Image */}
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="relative rounded-2xl overflow-hidden shadow-xl col-span-2"
  >
    <img
      src={IMG_TOP}
      alt="Main event"
      className="w-full h-full object-cover block"
    />
  </motion.div>

  {/* Bottom Left */}
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: 0.15 }}
    className="relative rounded-2xl overflow-hidden shadow-xl"
  >
    <img
      src={IMG_MAIN}
      alt="Event"
      className="w-full h-full object-cover block"
    />
  </motion.div>

  {/* Bottom Right */}
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: 0.3 }}
    className="relative rounded-2xl overflow-hidden shadow-xl"
  >
    <img
      src={IMG_BOT}
      alt="Festival"
      className="w-full h-full object-cover block"
    />
  </motion.div>

</div>

            {/* Floating stat — top left of mosaic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
              className="absolute -top-4 -left-4 px-4 py-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-100 dark:border-slate-800 shadow-xl hidden sm:flex items-center gap-3 z-20"
            >
              
             
            </motion.div>

            {/* Floating stat — bottom right of mosaic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.65, ease: "easeOut" }}
              className="absolute -bottom-4 -right-4 px-4 py-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-100 dark:border-slate-800 shadow-xl hidden sm:flex items-center gap-3 z-20"
            >
              
              
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
