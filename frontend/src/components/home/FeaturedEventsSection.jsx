import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Heart, ArrowRight,  } from "lucide-react";

const sampleFeaturedEvents = [
  { id: "evt_1", title: "Global Tech Summit 2026", category: "Technology", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80", date: "Aug 15, 2026", time: "09:00 AM PST", location: "San Francisco, CA", price: "$299.00" },
  { id: "evt_2", title: "UI/UX Design Masterclass & Expo", category: "Design", image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80", date: "Sep 02, 2026", time: "10:00 AM EST", location: "New York, NY", price: "$149.00" },
  { id: "evt_3", title: "Summer Music Festival 2026", category: "Music", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80", date: "Jul 30, 2026", time: "04:00 PM CST", location: "Austin, TX", price: "$89.00",  },
  { id: "evt_4", title: "AI & Machine Learning Conference", category: "Technology", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80", date: "Aug 28, 2026", time: "08:30 AM PST", location: "Seattle, WA", price: "Free" },
  { id: "evt_5", title: "FinTech Innovation Forum", category: "Business", image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80", date: "Oct 12, 2026", time: "09:30 AM GMT", location: "London, UK", price: "$450.00", },
  { id: "evt_6", title: "Health & Mindful Yoga Retreat", category: "Health", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80", date: "Sep 20, 2026", time: "07:00 AM PST", location: "Ojai Valley, CA", price: "$199.00"  },
];

export default function FeaturedEventsSection() {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <section id="events-section" className="home-section bg-white dark:bg-slate-900">
      <div className="home-container">
        <div className="home-section-header flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="home-eyebrow text-indigo-600 dark:text-indigo-400">Curated Experiences</span>
            <h2 className="home-title text-slate-900 dark:text-slate-100">Trending Events Near You</h2>
            <p className="home-desc text-slate-500 dark:text-slate-400 max-w-xl">
              Hand-picked events gaining momentum in your region.
            </p>
          </div>
          <Link to="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors shrink-0 pb-1">
            Browse All Events 
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="home-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {sampleFeaturedEvents.map((evt, idx) => {
            const isFav = favorites.includes(evt.id);
            
            return (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: idx * 0.07, ease: "easeOut" }}
                className="group flex flex-col rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow duration-300 h-full"
              >
                <div className="relative h-64 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                  <img src={evt.image} alt={evt.title} className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
                  <span className="absolute top-5 left-5 px-3 py-1.5 text-xs font-semibold bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-slate-100 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800">
                    {evt.category}
                  </span>
                  <button
                    onClick={(e) => toggleFavorite(e, evt.id)}
                    className="absolute top-5 right-5 p-2.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-700 dark:text-slate-200 hover:text-rose-500 transition-colors"
                  >
                    <Heart className={`h-4 w-4 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
                  </button>
                  <div className="absolute bottom-5 right-5 px-4 py-2   text-white font-bold text-sm shadow-md">
                    {evt.price}
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                      {evt.title}
                    </h3><br/>
                    
                    <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-indigo-500 shrink-0" />
                        <span>{evt.date} · {evt.time}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-indigo-500 shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    </div>
                  </div>

                 

                  <Link
                    to={`/events/${evt.id}`}
    className="inline-flex items-center justify-center   h-10  bg-blue-600 hover:bg-blue-700  text-white ">
                  
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
