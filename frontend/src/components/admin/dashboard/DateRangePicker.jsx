import { Calendar, ChevronDown } from "lucide-react";
import { Select } from "@/components/ui/select";

export default function DateRangePicker({ selectedRange, onRangeChange }) {
  const dateRanges = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 7 Days", value: "7days" },
    { label: "Last 30 Days", value: "30days" },
    { label: "This Month", value: "this_month" },
    { label: "Last Month", value: "last_month" },
    { label: "Custom Range", value: "custom" },
  ];

  return (
    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
      <Calendar className="h-4 w-4 text-slate-500 shrink-0" />
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline">
        Period:
      </span>
      <select
        value={selectedRange}
        onChange={(e) => onRangeChange(e.target.value)}
        className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer pr-2"
      >
        {dateRanges.map((range) => (
          <option key={range.value} value={range.value}>
            {range.label}
          </option>
        ))}
      </select>
    </div>
  );
}
