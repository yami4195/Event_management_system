import {
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  variant = "indigo",
}) {
  const colorVariants = {
    green: {
      iconContainer: "bg-emerald-50 border-emerald-100 text-emerald-600",
      trendBadge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    indigo: {
      iconContainer: "bg-indigo-50 border-indigo-100 text-indigo-600",
      trendBadge: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    rose: {
      iconContainer: "bg-rose-50 border-rose-100 text-rose-600",
      trendBadge: "bg-rose-50 text-rose-700 border-rose-200",
    },
    blue: {
      iconContainer: "bg-blue-50 border-blue-100 text-blue-600",
      trendBadge: "bg-blue-50 text-blue-700 border-blue-200",
    },
  };

  const currentVariant = colorVariants[variant] ?? colorVariants.indigo;

  return (
    <Card className="flex flex-col justify-between min-h-[220px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Top Header: Title + Icon */}
      <CardHeader className="p-0 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold tracking-wide text-slate-500">
          {title}
        </CardTitle>

        {Icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${currentVariant.iconContainer}`}>
            <Icon className="h-6 w-6" strokeWidth={2.2} />
          </div>
        )}
      </CardHeader>

      {/* Middle: Big Value */}
      <div className="my-4">
        <p className="text-4xl font-extrabold tracking-tight text-slate-900">
          {value}
        </p>
      </div>

      {/* Bottom: Trend Badge & Subtitle */}
      {(trend || description) && (
        <CardContent className="p-0 flex items-center justify-between gap-2 flex-wrap">
          {trend && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border ${
                trend.isPositive
                  ? colorVariants.green.trendBadge
                  : trend.isPositive === false
                  ? colorVariants.rose.trendBadge
                  : "bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              {trend.isPositive === true && <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.5} />}
              {trend.isPositive === false && <TrendingDown className="h-3.5 w-3.5" strokeWidth={2.5} />}
              {trend.isPositive === undefined && <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />}
              {trend.value}
            </span>
          )}

          {description && (
            <span className="text-xs font-medium text-slate-400">
              {description}
            </span>
          )}
        </CardContent>
      )}
    </Card>
  );
}