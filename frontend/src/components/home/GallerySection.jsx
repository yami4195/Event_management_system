import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X } from "lucide-react";

const galleryImages = [
  { id: 1, title: "Global Tech Summit Keynote", category: "Technology", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80" },
  { id: 2, title: "Summer Music Festival Crowd", category: "Music", url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80" },
  { id: 3, title: "UI/UX Design Workshop", category: "Design", url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80" },
  { id: 4, title: "FinTech Innovation Panel", category: "Business", url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80" },
  { id: 5, title: "Mindful Yoga Retreat", category: "Health", url: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=80" },
  { id: 6, title: "AI Developer Hackathon", category: "Hackathon", url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80" },
];

export default function GallerySection() {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <section className="home-section bg-white dark:bg-slate-900">
      <div className="home-container">
        <div className="home-section-header--center">
          <span className="home-eyebrow text-indigo-600 dark:text-indigo-400">Moments & Memories</span>
          <h2 className="home-title text-slate-900 dark:text-slate-100">EventFlow Photo Gallery</h2>
          <p className="home-desc text-slate-500 dark:text-slate-400 mx-auto">
            Highlights from extraordinary events hosted on our platform.
          </p>
        </div>

        <div className="home-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {galleryImages.map((img, idx) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: idx * 0.06, ease: "easeOut" }}
              onClick={() => setActiveImage(img)}
              className="relative h-80 rounded-3xl overflow-hidden cursor-pointer group border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              <img src={img.url} alt={img.title} className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">{img.category}</span>
                <h4 className="text-lg font-bold">{img.title}</h4>
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                  <Maximize2 className="h-4 w-4" /> Preview Photo
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl"
            >
              <button onClick={() => setActiveImage(null)} className="absolute top-5 right-5 p-2.5 rounded-full bg-slate-950/80 text-white hover:bg-rose-600 transition-colors z-10 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
              <img src={activeImage.url} alt={activeImage.title} className="w-full max-h-[75vh] object-contain" />
              <div className="p-8 bg-slate-950 border-t border-slate-800">
                <h4 className="text-lg font-bold text-white">{activeImage.title}</h4>
                <span className="text-sm text-indigo-400 font-medium">{activeImage.category}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
