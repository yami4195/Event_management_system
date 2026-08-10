import { Search, X } from "lucide-react";
import "../../styles/components/my-events.css";

export default function SearchBar({
  value = "",
  onChange,
  placeholder = "Search events by title, category, location...",
  onClear,
}) {
  return (
    <div className="search-box-custom">
      <Search className="search-icon-left" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input-field"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            if (onClear) onClear();
          }}
          className="search-clear-btn"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
