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
      icon: "bg-blue-50 text-blue-600 border-blue-100",
      accent: "bg-blue-500",
      sparkline: ["h-1.5", "h-3", "h-2.5", "h-5", "h-4", "h-5.5"],
    },
    indigo: {
      icon: "bg-indigo-50 text-indigo-600 border-indigo-100",
      accent: "bg-indigo-500",
      sparkline: ["h-2", "h-4", "h-3", "h-5.5", "h-4.5", "h-6"],
    },
    emerald: {
      icon: "bg-emerald-50 text-emerald-600 border-emerald-100",
      accent: "bg-emerald-500",
      sparkline: ["h-1.5", "h-2.5", "h-4", "h-5", "h-5.5", "h-6"],
    },
    amber: {
      icon: "bg-amber-50 text-amber-600 border-amber-100",
      accent: "bg-amber-500",
      sparkline: ["h-3", "h-5", "h-4", "h-3", "h-5", "h-4"],
    },
    purple: {
      icon: "bg-purple-50 text-purple-600 border-purple-100",
      accent: "bg-purple-500",
      sparkline: ["h-2", "h-3", "h-5", "h-6", "h-4", "h-6"],
    },
    rose: {
      icon: "bg-rose-50 text-rose-600 border-rose-100",
      accent: "bg-rose-500",
      sparkline: ["h-4", "h-3", "h-2.5", "h-4", "h-3", "h-2.5"],
    },
  };

  const currentVariant = colorVariants[variant] || colorVariants.blue;

  return (
    <div className="rounded-lg border border-slate-200/90 bg-white p-4 shadow-2xs flex flex-col justify-between h-full min-h-[125px]">
      {/* Header: Title and Icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 leading-none">
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
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 leading-none">
            {value}
          </span>
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${
                trend.isPositive === true
                  ? "text-emerald-600"
                  : trend.isPositive === false
                  ? "text-rose-600"
                  : "text-slate-500"
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
        <div className="mt-2 pt-2 border-t border-slate-100/80">
          <span className="text-slate-400 font-medium text-[11px] block truncate">
            {description}
          </span>
        </div>
      )}
    </div>
  );
}