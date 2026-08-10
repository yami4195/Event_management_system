import SearchBar from "./SearchBar";
import { LayoutGrid, List, RotateCcw } from "lucide-react";
import "../../styles/components/my-events.css";

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
    <div className="my-events-filter-bar">
      <SearchBar
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search by event title, location, or category..."
      />

      <div className="filter-controls-group">
        {/* Status Select */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="filter-select-field"
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="upcoming">Upcoming</option>
          <option value="draft">Draft</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Category Select */}
        {categories.length > 0 && (
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="filter-select-field"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}

        {/* Reset Filter Button */}
        {(searchQuery || statusFilter !== "all" || categoryFilter !== "all") && (
          <button type="button" onClick={onReset} className="reset-filter-btn">
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}

        {/* View Mode Switcher */}
        {onViewModeChange && (
          <div className="view-mode-toggle">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={`view-mode-btn ${viewMode === "grid" ? "active" : ""}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("table")}
              className={`view-mode-btn ${viewMode === "table" ? "active" : ""}`}
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
