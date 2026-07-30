import { useState } from "react";
import { useOrganizer } from "../../hooks/useOrganizer";
import AnalyticsCard from "../../components/organizer/AnalyticsCard";
import DashboardCard from "../../components/organizer/DashboardCard";
import { formatCurrency } from "../../utils/organizerHelpers";
import { DollarSign, Ticket, TrendingUp, Calendar } from "lucide-react";

export default function Analytics() {
  const { loading, analytics } = useOrganizer();
  const [timeRange, setTimeRange] = useState("30_days");

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black dark:border-white" />
      </div>
    );
  }

  const maxRevenue = Math.max(...analytics.monthlyRevenue.map((m) => m.revenue));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Event Analytics & Growth
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time performance metrics, ticket sales distribution, and revenue trends.
          </p>
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-black/20"
        >
          <option value="7_days">Last 7 Days</option>
          <option value="30_days">Last 30 Days</option>
          <option value="12_months">Last 12 Months</option>
        </select>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <DashboardCard
          title="Total Ticket Revenue"
          value={formatCurrency(analytics.totalRevenue)}
          trend={analytics.revenueTrend}
          isPositive={true}
          icon={DollarSign}
        />
        <DashboardCard
          title="Tickets Sold"
          value={analytics.ticketsSold}
          trend={analytics.ticketsTrend}
          isPositive={true}
          icon={Ticket}
        />
        <DashboardCard
          title="Active Event Listings"
          value={analytics.activeEvents}
          trend="Published"
          isPositive={true}
          icon={Calendar}
        />
        <DashboardCard
          title="Ticket Conversion Rate"
          value={analytics.completionRate}
          trend="+3.2%"
          isPositive={true}
          icon={TrendingUp}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Growth Bar Visualizer (2 cols) */}
        <div className="lg:col-span-2">
          <AnalyticsCard
            title="Monthly Revenue Trend (ETB)"
            subtitle="Gross ticket sales over the past 7 months"
          >
            <div className="pt-6 pb-2">
              <div className="flex items-end justify-between h-56 gap-3">
                {analytics.monthlyRevenue.map((item) => {
                  const heightPct = Math.round((item.revenue / maxRevenue) * 100);
                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-black dark:text-white bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-300 dark:border-zinc-700">
                        {formatCurrency(item.revenue)}
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-xl h-full flex items-end overflow-hidden">
                        <div
                          className="w-full bg-zinc-900 dark:bg-white rounded-t-xl transition-all duration-500 group-hover:brightness-125"
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </AnalyticsCard>
        </div>

        {/* Category Breakdown (1 col) */}
        <div>
          <AnalyticsCard
            title="Sales by Category"
            subtitle="Ticket sales distribution by interest"
          >
            <div className="space-y-5 pt-4">
              {analytics.categoryBreakdown.map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800 dark:text-slate-200">{cat.name}</span>
                    <span className="text-slate-500">{cat.count} tickets ({cat.percentage}%)</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-900 dark:bg-white rounded-full"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </AnalyticsCard>
        </div>
      </div>

      {/* Top Events Leaderboard */}
      <AnalyticsCard
        title="Top Performing Events Leaderboard"
        subtitle="Ranked by total ticket revenue"
      >
        <div className="divide-y divide-slate-100 dark:divide-slate-800 pt-2">
          {analytics.topEvents.map((evt, idx) => (
            <div key={evt.name} className="py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs flex items-center justify-center">
                  #{idx + 1}
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{evt.name}</div>
                  <div className="text-xs text-slate-500">{evt.tickets} tickets sold</div>
                </div>
              </div>
              <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                {formatCurrency(evt.revenue)}
              </div>
            </div>
          ))}
        </div>
      </AnalyticsCard>
    </div>
  );
}
