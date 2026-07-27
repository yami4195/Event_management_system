import { Search, Filter, Calendar, MapPin, SlidersHorizontal, RotateCcw } from "lucide-react";

export default function EventFilter({
  categories = [],
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  selectedDateRange,
  setSelectedDateRange,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
  onResetFilters,
  totalResultsCount = 0
}) {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800 shadow-sm sticky top-0 z-30 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col gap-4">

          {/* TOP BAR: Title Search & Action Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search event title or keywords..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id || cat.slug || cat.name} value={cat.slug || cat.name}>
                    {cat.name} {cat.count ? `(${cat.count})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Dropdown */}
            <div className="md:col-span-2">
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                >
                  <option value="">All Locations</option>
                  <option value="San Francisco">San Francisco, CA</option>
                  <option value="New York">New York, NY</option>
                  <option value="Austin">Austin, TX</option>
                  <option value="Seattle">Seattle, WA</option>
                  <option value="London">London, UK</option>
                  <option value="Virtual">Virtual / Online</option>
                </select>
              </div>
            </div>

            {/* Sort Options */}
            <div className="md:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
              >
                <option value="upcoming">Sort: Upcoming</option>
                <option value="newest">Sort: Newest First</option>
                <option value="popular">Sort: Most Popular</option>
                <option value="price_low">Sort: Price (Low to High)</option>
              </select>
            </div>

          </div>

          {/* SECONDARY ROW: Date, Status Filter & Active Filter Chips */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mr-1">
                <SlidersHorizontal className="h-3.5 w-3.5" /> Filters:
              </span>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {[
                  { id: "", label: "All Status" },
                  { id: "Open", label: "Open" },
                  { id: "Almost Full", label: "Almost Full" },
                  { id: "Sold Out", label: "Sold Out" },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStatus(st.id)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      selectedStatus === st.id
                        ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Date Filter Buttons */}
              <div className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {[
                  { id: "", label: "Anytime" },
                  { id: "this_week", label: "This Week" },
                  { id: "this_month", label: "This Month" },
                ].map((dt) => (
                  <button
                    key={dt.id}
                    onClick={() => setSelectedDateRange(dt.id)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      selectedDateRange === dt.id
                        ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {dt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count & Reset Button */}
            <div className="flex items-center gap-4 ml-auto">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Showing <strong className="text-slate-900 dark:text-white font-bold">{totalResultsCount}</strong> events
              </span>

              {(searchTerm || selectedCategory || selectedLocation || selectedStatus || selectedDateRange) && (
                <button
                  onClick={onResetFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200/60 dark:border-rose-900 font-semibold hover:bg-rose-100 transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
