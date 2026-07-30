import { TrendingUp, TrendingDown } from "lucide-react";

export default function DashboardCard({
  title,
  value,
  trend,
  isPositive = true,
  icon: Icon,
  iconBg = "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
}) {
  return (
    <div className="summary-card">
      <div className="summary-card-header">
        <span className="summary-card-label">{title}</span>
        {Icon && (
          <div className={`summary-card-icon-wrap ${iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-end justify-between mt-2">
        <div className="summary-card-value">{value}</div>

        {trend && (
          <div
            className={`summary-card-trend ${
              isPositive
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}
