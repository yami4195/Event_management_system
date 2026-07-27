import { motion } from "framer-motion";
import {
  Cpu,
  Briefcase,
  GraduationCap,
  Activity,
  Film,
  Trophy,
  Palette,
  Grid,
  Sparkles,
  ArrowRight
} from "lucide-react";

const ICON_MAP = {
  Cpu: Cpu,
  Briefcase: Briefcase,
  GraduationCap: GraduationCap,
  Activity: Activity,
  Film: Film,
  Trophy: Trophy,
  Palette: Palette,
  Grid: Grid,
};

export default function EventCategories({ categories = [], selectedCategory, onSelectCategory }) {
  return (
    <section className="py-14 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide mb-2">
              <Sparkles className="h-3.5 w-3.5" /> Diverse Topics
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explore Event Categories
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Select a category to filter upcoming global conferences, expos, and workshops.
            </p>
          </div>

          {selectedCategory && (
            <button
              onClick={() => onSelectCategory("")}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Clear Category Filter <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat, idx) => {
            const IconComponent = ICON_MAP[cat.icon] || Grid;
            const isSelected = selectedCategory === (cat.slug || cat.name) || (selectedCategory === "" && cat.id === "cat_all");

            return (
              <motion.button
                key={cat.id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                onClick={() => onSelectCategory(cat.id === "cat_all" ? "" : (cat.slug || cat.name))}
                className={`group relative p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
                  isSelected
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/25 scale-[1.02]"
                    : "bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-800 hover:bg-white dark:hover:bg-slate-800/80 hover:shadow-md"
                }`}
              >
                <div
                  className={`p-3 rounded-xl transition-colors ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white"
                  }`}
                >
                  <IconComponent className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </div>

                <div className="space-y-0.5">
                  <span className="block text-xs font-bold truncate max-w-[100px]">
                    {cat.name}
                  </span>
                  {cat.count !== undefined && (
                    <span
                      className={`text-[10px] font-medium block ${
                        isSelected ? "text-indigo-100" : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {cat.count} Events
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
