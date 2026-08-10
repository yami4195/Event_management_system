import { useState } from "react";
import { useOrganizer } from "../../hooks/useOrganizer";
import AnalyticsCard from "../../components/organizer/AnalyticsCard";
import { formatCurrency } from "../../utils/organizerHelpers";
import { DollarSign, Ticket, TrendingUp, Calendar } from "lucide-react";
import "../../styles/components/analytics.css";

export default function Analytics() {
  const { loading, analytics } = useOrganizer();
  const [timeRange, setTimeRange] = useState("30_days");

  if (loading || !analytics) {
    return (
      <div className="analytics-wrapper" style={{ alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3" />
        <p style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>Loading Performance Metrics...</p>
      </div>
    );
  }

  const maxRevenue = Math.max(...(analytics.monthlyRevenue?.map((m) => m.revenue) || [1]), 1);

  return (
    <div className="analytics-wrapper">
      {/* Header Card */}
      <div className="analytics-header-card">
        <div className="analytics-title-area">
          <h1>Event Analytics & Growth</h1>
          <p>Real-time performance metrics, ticket sales distribution, and gross revenue trends.</p>
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="analytics-time-select"
        >
          <option value="7_days">Last 7 Days</option>
          <option value="30_days">Last 30 Days</option>
          <option value="12_months">Last 12 Months</option>
        </select>
      </div>

      {/* Top Metric Cards */}
      <div className="analytics-metrics-grid">
        <div className="analytics-metric-card">
          <div className="metric-card-top">
            <span className="metric-card-label">Total Revenue</span>
            <div className="metric-icon-box metric-icon-blue">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="metric-card-bottom">
            <span className="metric-card-val">{formatCurrency(analytics.totalRevenue)}</span>
            <span className="metric-trend-badge">{analytics.revenueTrend || "+12.4%"}</span>
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="metric-card-top">
            <span className="metric-card-label">Tickets Sold</span>
            <div className="metric-icon-box metric-icon-emerald">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="metric-card-bottom">
            <span className="metric-card-val">{analytics.ticketsSold}</span>
            <span className="metric-trend-badge">{analytics.ticketsTrend || "+8.2%"}</span>
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="metric-card-top">
            <span className="metric-card-label">Active Events</span>
            <div className="metric-icon-box metric-icon-purple">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="metric-card-bottom">
            <span className="metric-card-val">{analytics.activeEvents}</span>
            <span className="metric-trend-badge" style={{ background: "#f3e8ff", color: "#9333ea" }}>Published</span>
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="metric-card-top">
            <span className="metric-card-label">Completion Rate</span>
            <div className="metric-icon-box metric-icon-amber">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="metric-card-bottom">
            <span className="metric-card-val">{analytics.completionRate}</span>
            <span className="metric-trend-badge" style={{ background: "#fef3c7", color: "#d97706" }}>High Growth</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="analytics-charts-grid">
        {/* Revenue Growth Bar Visualizer */}
        <AnalyticsCard
          title="Monthly Revenue Trend (ETB)"
          subtitle="Gross ticket sales over past 7 months"
        >
          <div className="bar-chart-container">
            {analytics.monthlyRevenue?.map((item) => {
              const heightPct = Math.round((item.revenue / maxRevenue) * 100);
              return (
                <div key={item.month} className="bar-chart-col">
                  <span className="bar-chart-tooltip">{formatCurrency(item.revenue)}</span>
                  <div className="bar-chart-track">
                    <div className="bar-chart-fill" style={{ height: `${heightPct}%` }} />
                  </div>
                  <span className="bar-chart-month">{item.month}</span>
                </div>
              );
            })}
          </div>
        </AnalyticsCard>

        {/* Category Breakdown */}
        <AnalyticsCard
          title="Sales by Category"
          subtitle="Ticket sales distribution"
        >
          <div className="cat-progress-list">
            {analytics.categoryBreakdown?.map((cat) => (
              <div key={cat.name} className="cat-progress-item">
                <div className="cat-progress-labels">
                  <span className="cat-progress-name">{cat.name}</span>
                  <span className="cat-progress-stats">{cat.count} tickets ({cat.percentage}%)</span>
                </div>
                <div className="cat-progress-track">
                  <div className="cat-progress-fill" style={{ width: `${cat.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </AnalyticsCard>
      </div>

      {/* Top Events Leaderboard */}
      <AnalyticsCard
        title="Top Performing Events Leaderboard"
        subtitle="Ranked by gross ticket revenue"
      >
        <div className="leaderboard-list">
          {analytics.topEvents?.map((evt, idx) => (
            <div key={evt.name} className="leaderboard-row">
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div className="leaderboard-rank-badge">#{idx + 1}</div>
                <div>
                  <h4 className="leaderboard-event-title">{evt.name}</h4>
                  <div className="leaderboard-event-sub">{evt.tickets} tickets sold</div>
                </div>
              </div>
              <span className="leaderboard-revenue">{formatCurrency(evt.revenue)}</span>
            </div>
          ))}
        </div>
      </AnalyticsCard>
    </div>
  );
}
