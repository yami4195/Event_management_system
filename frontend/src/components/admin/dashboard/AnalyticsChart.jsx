import { useState } from "react";
import { TrendingUp, BarChart2, Layers } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AnalyticsChart() {
  const [activeTimeframe, setActiveTimeframe] = useState("7days");
  const [activeMetric, setActiveMetric] = useState("revenue");
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const timeframes = [
    { id: "7days", label: "7 Days" },
    { id: "30days", label: "30 Days" },
    { id: "90days", label: "90 Days" },
    { id: "1year", label: "1 Year" },
  ];

  const chartDatasets = {
    "7days": {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      revenue: [3200, 4100, 3800, 5600, 7200, 8900, 6800],
      tickets: [120, 150, 140, 210, 280, 340, 260],
      registrations: [45, 60, 52, 78, 95, 110, 85],
    },
    "30days": {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      revenue: [18500, 24200, 28900, 34100],
      tickets: [720, 910, 1050, 1280],
      registrations: [280, 340, 410, 490],
    },
    "90days": {
      labels: ["Month 1", "Month 2", "Month 3"],
      revenue: [62000, 78500, 94200],
      tickets: [2400, 3100, 3800],
      registrations: [890, 1150, 1420],
    },
    "1year": {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      revenue: [180000, 240000, 290000, 342000],
      tickets: [7800, 9800, 11500, 13400],
      registrations: [2800, 3600, 4200, 5100],
    },
  };

  const currentData = chartDatasets[activeTimeframe] || chartDatasets["7days"];
  const values = currentData[activeMetric];
  const maxValue = Math.max(...values, 1);

  // Calculate SVG curve path points
  const width = 650;
  const height = 220;
  const padding = 20;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  const points = values.map((val, i) => {
    const x = padding + (i / (values.length - 1 || 1)) * usableWidth;
    const y = height - padding - (val / maxValue) * usableHeight;
    return { x, y, value: val, label: currentData.labels[i] };
  });

  const pathD = points.reduce((acc, pt, idx, arr) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[idx - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  const formatMetricValue = (val) => {
    if (activeMetric === "revenue") return `$${val.toLocaleString()}`;
    return val.toLocaleString();
  };

  return (
    <Card className="border-slate-200/80 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Performance & Revenue Analytics
          </CardTitle>
          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-400 mt-0.5">
            Real-time trends for revenue, tickets, and event registrations.
          </p>
        </div>

        {/* Timeframe selector tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200/60 dark:border-slate-700">
          {timeframes.map((tf) => (
            <Button
              key={tf.id}
              variant="ghost"
              size="xs"
              onClick={() => setActiveTimeframe(tf.id)}
              className={`text-xs font-bold px-2.5 py-1 rounded-md transition-all ${
                activeTimeframe === tf.id
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-black"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              {tf.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-4">
        {/* Metric Selector Buttons */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap">
          <Button
            size="xs"
            variant="outline"
            onClick={() => setActiveMetric("revenue")}
            className={`gap-1.5 border ${
              activeMetric === "revenue"
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-bold"
                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Revenue
          </Button>

          <Button
            size="xs"
            variant="outline"
            onClick={() => setActiveMetric("tickets")}
            className={`gap-1.5 border ${
              activeMetric === "tickets"
                ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800 font-bold"
                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            Tickets Sold
          </Button>

          <Button
            size="xs"
            variant="outline"
            onClick={() => setActiveMetric("registrations")}
            className={`gap-1.5 border ${
              activeMetric === "registrations"
                ? "bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800 font-bold"
                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            Registrations
          </Button>
        </div>

        {/* SVG Area Chart Container */}
        <div className="relative w-full overflow-x-auto pt-2">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56 overflow-visible">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={
                    activeMetric === "revenue"
                      ? "#10b981"
                      : activeMetric === "tickets"
                      ? "#6366f1"
                      : "#a855f7"
                  }
                  stopOpacity="0.25"
                />
                <stop
                  offset="100%"
                  stopColor={
                    activeMetric === "revenue"
                      ? "#10b981"
                      : activeMetric === "tickets"
                      ? "#6366f1"
                      : "#a855f7"
                  }
                  stopOpacity="0.0"
                />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
              const y = height - padding - pct * usableHeight;
              return (
                <line
                  key={idx}
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              );
            })}

            {/* Gradient Area Fill */}
            <path d={areaD} fill="url(#chartGradient)" />

            {/* Curve Line */}
            <path
              d={pathD}
              fill="none"
              stroke={
                activeMetric === "revenue"
                  ? "#10b981"
                  : activeMetric === "tickets"
                  ? "#6366f1"
                  : "#a855f7"
              }
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Interactive Data Points */}
            {points.map((pt, idx) => (
              <g key={idx}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  className="fill-white stroke-[3] cursor-pointer transition-all duration-150 hover:r-7"
                  stroke={
                    activeMetric === "revenue"
                      ? "#10b981"
                      : activeMetric === "tickets"
                      ? "#6366f1"
                      : "#a855f7"
                  }
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                <text
                  x={pt.x}
                  y={height - 2}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-slate-400"
                >
                  {pt.label}
                </text>
              </g>
            ))}
          </svg>

          {/* Hover Tooltip display */}
          {hoveredPoint && (
            <div className="absolute top-2 right-4 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-2">
              <span className="text-slate-300">{hoveredPoint.label}:</span>
              <span className="text-emerald-400 font-extrabold">
                {formatMetricValue(hoveredPoint.value)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
