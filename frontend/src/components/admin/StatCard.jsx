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
  variant = "blue",
}) {
  const colorVariants = {
    blue: {
      icon: "bg-blue-50 text-blue-600 border-blue-100",
    },
    indigo: {
      icon: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    amber: {
      icon: "bg-amber-50 text-amber-600 border-amber-100",
    },
    emerald: {
      icon: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    purple: {
      icon: "bg-purple-50 text-purple-600 border-purple-100",
    },
  };

  const currentVariant =
    colorVariants[variant] ?? colorVariants.blue;

  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-slate-200">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-xs uppercase tracking-wider text-slate-500">
            {title}
          </CardTitle>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        {Icon && (
          <div
            className={`rounded-xl border p-3 ${currentVariant.icon}`}
          >
            <Icon className="h-6 w-6" />
          </div>
        )}
      </CardHeader>

      {(trend || description) && (
        <CardContent className="border-t pt-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {trend && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border
                ${
                  trend.isPositive
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : trend.isPositive === false
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {trend.isPositive === true && (
                  <TrendingUp className="h-3.5 w-3.5" />
                )}

                {trend.isPositive === false && (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}

                {trend.isPositive === undefined && (
                  <Minus className="h-3.5 w-3.5" />
                )}

                {trend.value}
              </span>
            )}

            {description && (
              <span className="text-xs text-slate-500">
                {description}
              </span>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}