import SearchBar from "./SearchBar";
import { LayoutGrid, List, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";

export default function FilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  viewMode,
  onViewModeChange,
  categories = [],
  onReset,
}) {
  return (
    <div className="filter-bar-wrap">
      <SearchBar
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search by title, location, or category..."
      />

      <div className="flex flex-wrap items-center gap-3">
        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-10 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="upcoming">Upcoming</option>
          <option value="draft">Draft</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Category Dropdown */}
        {categories.length > 0 && (
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="h-10 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}

        {/* Reset Filters */}
        {(searchQuery || statusFilter !== "all" || categoryFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-10 px-3 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset
          </Button>
        )}

        {/* Grid / Table View Switcher */}
        {onViewModeChange && (
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={`p-1.5 rounded-lg text-sm transition-colors ${
                viewMode === "grid"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("table")}
              className={`p-1.5 rounded-lg text-sm transition-colors ${
                viewMode === "table"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
