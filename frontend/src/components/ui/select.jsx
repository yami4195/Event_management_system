import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Select = React.forwardRef(
  ({ className, children, value, onChange, placeholder, ...props }, ref) => {
    return (
      <div className="relative inline-block w-full">
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          className={cn(
            "h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-1 pr-8 text-sm font-medium text-slate-900 shadow-xs transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 stroke-[2]" />
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
