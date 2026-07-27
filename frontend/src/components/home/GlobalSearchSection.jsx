import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Tag } from "lucide-react";
import { motion } from "framer-motion";

export default function GlobalSearchSection() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [date, setDate] = useState("");
  const [searchIconVisible,setSearchIconVisible] = useState(true);
  const [categoryIconVisible,setCategoryIconVisible] = useState(true);
  const [locationIconVisisble,setLocationIconVisisble] = useState(true);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.append("search", query);
    if (category !== "all") params.append("category", category);
    if (location !== "all") params.append("location", location);
    if (date) params.append("date", date);
    navigate(`/events?${params.toString()}`);
  };

  const inputClass =
    "w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/80";

  return (
<div className="home-search-wrap max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="home-search-panel bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800"
      >
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 items-end">
          <div  className="lg:col-span-4 space-y-3">
          <h2 className="mb-6 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white"> Discover events happening near you</h2><br/>

            <h4 className="text-sm text-slate-700 dark:text-slate-400 mt-1">
            Filter by category, location, or date to find your next event

          </h4>
            <div className="relative">
              {searchIconVisible &&(
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />)}
              <input
                type="text"
                placeholder="       Search events by name..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchIconVisible(e.target.value== "")
                }}
                className={inputClass}
              />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Category
            </label>
            <div className="relative">
              {categoryIconVisible &&(
              <Tag className="absolute right-28 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />)}
              <select value={category} onChange={(e) => {
                setCategory(e.target.value);
                setCategoryIconVisible(e.target.value== "");}}
                className={`${inputClass} cursor-pointer`}>
                  <option value="category" disabled>Select A Category</option>
                <option value="all"> All Categories</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Music">Music & Entertainment</option>
                <option value="Design">Design & UX</option>
                <option value="Health">Health & Wellness</option>
                <option value="Sports">Sports & Fitness</option>
              </select>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Location
            </label>
            <div className="relative">
              {locationIconVisisble &&(
              <MapPin className="absolute right-15 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />)}
              <select value={location} onChange={(e) =>{
                 setLocation(e.target.value)
                setLocationIconVisisble(e.target.value== "");
              }
                }
                  className={`${inputClass} cursor-pointer`}>
                <option value="all">All Cities</option>
                <option value="San Francisco">San Francisco</option>
                <option value="New York">New York</option>
                <option value="Austin">Austin</option>
                <option value="London">London</option>
                <option value="Seattle">Seattle</option>
              </select>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Date
            </label>
            <div className="relative">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`${inputClass} cursor-pointer`} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <button
              type="submit"
              className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-600/15 transition-colors cursor-pointer"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline lg:hidden">Search</span>
            </button>
          </div>
        </form>
        
      </motion.div>
    </div>
  );
}
