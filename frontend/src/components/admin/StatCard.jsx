import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  variant = "blue",
}) {
  const colorVariants = {
    blue: {
      icon: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50",
      accent: "bg-blue-500",
      sparkline: ["h-1.5", "h-3", "h-2.5", "h-5", "h-4", "h-5.5"],
    },
    indigo: {
      icon: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50",
      accent: "bg-indigo-500",
      sparkline: ["h-2", "h-4", "h-3", "h-5.5", "h-4.5", "h-6"],
    },
    emerald: {
      icon: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50",
      accent: "bg-emerald-500",
      sparkline: ["h-1.5", "h-2.5", "h-4", "h-5", "h-5.5", "h-6"],
    },
    amber: {
      icon: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50",
      accent: "bg-amber-500",
      sparkline: ["h-3", "h-5", "h-4", "h-3", "h-5", "h-4"],
    },
    purple: {
      icon: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50",
      accent: "bg-purple-500",
      sparkline: ["h-2", "h-3", "h-5", "h-6", "h-4", "h-6"],
    },
    rose: {
      icon: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50",
      accent: "bg-rose-500",
      sparkline: ["h-4", "h-3", "h-2.5", "h-4", "h-3", "h-2.5"],
    },
  };

  const currentVariant = colorVariants[variant] || colorVariants.blue;

  return (
    <div className="rounded-lg border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xs flex flex-col justify-between h-full min-h-[125px] transition-colors duration-200">
      {/* Header: Title and Icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 leading-none">
          {title}
        </span>
        {Icon && (
          <div
            className={`p-2 rounded-md border flex items-center justify-center shrink-0 ${currentVariant.icon}`}
          >
            <Icon className="h-4 w-4 stroke-[2]" />
          </div>
        )}
      </div>

      {/* Middle: Compact Value & Micro Sparkline */}
      <div className="mt-2.5 flex items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-none">
            {value}
          </span>
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${
                trend.isPositive === true
                  ? "text-emerald-600 dark:text-emerald-400"
                  : trend.isPositive === false
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {trend.isPositive === true && <TrendingUp className="h-3 w-3" />}
              {trend.isPositive === false && <TrendingDown className="h-3 w-3" />}
              {trend.isPositive === undefined && <Minus className="h-3 w-3" />}
              {trend.value}
            </span>
          )}
        </div>

        {/* ColorLib style micro bar chart indicator */}
        <div className="flex items-end gap-1 h-6 shrink-0 pb-0.5">
          {currentVariant.sparkline.map((hClass, idx) => (
            <span
              key={idx}
              className={`w-1 rounded-xs ${currentVariant.accent} opacity-50 ${hClass}`}
            />
          ))}
        </div>
      </div>

      {/* Subtitle */}
      {description && (
        <div className="mt-2 pt-2 border-t border-slate-100/80 dark:border-slate-800">
          <span className="text-slate-400 dark:text-slate-400 font-medium text-[11px] block truncate">
            {description}
          </span>
        </div>
      )}
    </div>
  );
}