import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, Camera } from "lucide-react";
import "@/styles/components/Gallery.css";

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

  // Keyboard Escape key handler to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveImage(null);
      }
    };
    if (activeImage) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImage]);

  return (
    <section className="gallery-section" id="gallery-section">
      <div className="gallery-bg-glow" aria-hidden="true" />

      <div className="gallery-container">
        {/* Section Header */}
        <div className="gallery-header">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="gallery-badge"
          >
            <Camera className="gallery-badge-icon" />
            <span>Moments & Memories</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="gallery-title"
          >
            EventFlow <span className="gallery-title-accent">Photo Gallery</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="gallery-subtitle"
          >
            Highlights from extraordinary summits, festivals, and workshops hosted on our platform.
          </motion.p>
        </div>

        {/* 3-Column Responsive Grid */}
        <div className="gallery-grid">
          {galleryImages.map((img, idx) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              onClick={() => setActiveImage(img)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveImage(img);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View photo: ${img.title}`}
              className="gallery-card"
            >
              <img
                src={img.url}
                alt={img.title}
                className="gallery-image"
                loading="lazy"
              />
              <div className="gallery-overlay">
                <span className="gallery-category-badge">{img.category}</span>
                <h3 className="gallery-card-title">{img.title}</h3>
                <div className="gallery-preview-hint">
                  <Maximize2 className="gallery-preview-icon" />
                  <span>Preview Photo</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="gallery-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label={`Photo lightbox for ${activeImage.title}`}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="gallery-modal-content"
            >
              <button
                onClick={() => setActiveImage(null)}
                className="gallery-modal-close-btn"
                aria-label="Close photo preview"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>

              <img
                src={activeImage.url}
                alt={activeImage.title}
                className="gallery-modal-image"
              />

              <div className="gallery-modal-caption">
                <h3 className="gallery-modal-title">{activeImage.title}</h3>
                <span className="gallery-modal-tag">{activeImage.category}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
