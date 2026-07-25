import { TrendingUp, DollarSign, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function RevenueSummary({ selectedRange = "30days" }) {
  const summaryData = [
    {
      period: "Revenue Today",
      amount: "$3,218",
      change: "+8.4%",
      isPositive: true,
      comparison: "vs $2,968 yesterday",
      accent: "bg-emerald-500",
    },
    {
      period: "Revenue This Week",
      amount: "$14,520",
      change: "+14.2%",
      isPositive: true,
      comparison: "vs $12,710 last week",
      accent: "bg-blue-500",
    },
    {
      period: "Revenue This Month",
      amount: "$48,920",
      change: "+18.6%",
      isPositive: true,
      comparison: "vs $41,250 last month",
      accent: "bg-indigo-500",
    },
    {
      period: "Revenue This Year",
      amount: "$342,000",
      change: "+22.1%",
      isPositive: true,
      comparison: "vs $280,000 last year",
      accent: "bg-purple-500",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {summaryData.map((item, index) => (
        <Card
          key={index}
          className="relative overflow-hidden border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 group bg-white"
        >
          {/* Top colored accent bar matching ColorLib design */}
          <div className={`absolute top-0 left-0 right-0 h-1 ${item.accent}`} />

          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {item.period}
              </span>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-600">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {item.amount}
              </div>
              <span
                className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full border ${
                  item.isPositive
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                }`}
              >
                {item.isPositive ? (
                  <ArrowUpRight className="h-3 w-3 mr-0.5" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-0.5" />
                )}
                {item.change}
              </span>
            </div>

            <p className="mt-2 text-xs font-medium text-slate-400 truncate">
              {item.comparison}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
