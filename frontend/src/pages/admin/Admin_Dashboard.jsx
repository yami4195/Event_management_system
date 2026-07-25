import { useState } from "react";
import {
  Users,
  CalendarDays,
  Clock3,
  Search,
  DollarSign,
} from "lucide-react";

import StatCard from "@/components/admin/StatCard";
import AdminTable from "@/components/admin/AdminTable";
import DateRangePicker from "@/components/admin/dashboard/DateRangePicker";
import AnalyticsChart from "@/components/admin/dashboard/AnalyticsChart";
import RecentActivities from "@/components/admin/dashboard/RecentActivities";
import TopEventsLeaderboard from "@/components/admin/dashboard/TopEventsLeaderboard";
import SystemHealthWidget from "@/components/admin/dashboard/SystemHealthWidget";
import QuickActionsPanel from "@/components/admin/dashboard/QuickActionsPanel";
import ReportsExportPanel from "@/components/admin/dashboard/ReportsExportPanel";
import { Input } from "@/components/ui/input";

const columns = ["Title", "Organizer", "Date", "Location", "Status", "Action"];

const recentEventsData = [
  {
    id: "evt_1",
    title: "Global Tech Summit 2026",
    organizer: "Sarah Chen",
    date: "Aug 15",
    location: "San Francisco",
    status: "Published",
  },
  {
    id: "evt_2",
    title: "UI/UX Design Masterclass",
    organizer: "Emily Davis",
    date: "Sep 02",
    location: "New York",
    status: "Published",
  },
  {
    id: "evt_3",
    title: "Summer Music Fest 2026",
    organizer: "Robert Wilson",
    date: "Aug 28",
    location: "Austin",
    status: "Pending",
  },
  {
    id: "evt_4",
    title: "Startup Founders Expo",
    organizer: "James Anderson",
    date: "Oct 10",
    location: "Boston",
    status: "Pending",
  },
  {
    id: "evt_7",
    title: "FinTech Innovation Forum",
    organizer: "Jessica Taylor",
    date: "Dec 01",
    location: "London",
    status: "Cancelled",
  },
];

export default function Dashboard() {
  const [selectedRange, setSelectedRange] = useState("30days");
  const [globalSearch, setGlobalSearch] = useState("");

  const filteredEvents = recentEventsData.filter((evt) => {
    if (!globalSearch) return true;
    const q = globalSearch.toLowerCase();
    return (
      evt.title.toLowerCase().includes(q) ||
      evt.organizer.toLowerCase().includes(q) ||
      evt.location.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-10 lg:space-y-12 text-slate-900 pb-16">
      {/* Dashboard Sub-Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
         
          <div className="flex items-center gap-2.5">
           
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Operational
            </span>
          </div>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Welcome back! Real-time operations and platform metrics.
          </p>
        </div>

        {/* Date Range Selector Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <DateRangePicker
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
          />
        </div>
      </div>

      {/* SECTION 1: Top Key Statistics */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-690">
          Key Performance Indicators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Users"
            value="2,500"
            icon={Users}
            description="vs last week"
            trend={{ value: "+12%", isPositive: true }}
            variant="blue"
          />

          <StatCard
            title="Total Events"
            value="142"
            icon={CalendarDays}
            description="vs last month"
            trend={{ value: "+8%", isPositive: true }}
            variant="indigo"
          />

          <StatCard
            title="Total Revenue"
            value="$48,920"
            icon={DollarSign}
            description="vs last period"
            trend={{ value: "+18%", isPositive: true }}
            variant="emerald"
          />

          <StatCard
            title="Pending Review"
            value="7"
            icon={Clock3}
            description="Requires review"
            trend={{ value: "Action Needed", isPositive: false }}
            variant="rose"
          />
        </div>
      </section>

      {/* SECTION 2: Analytics & Trends (Full Width) */}
      <section className="space-y-3">
        
        <AnalyticsChart />
      </section>

      {/* SECTION 3: Live Operations & Activity Feed */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Operations & Recent Activity
        </h2>
        <div className="grid gap-6 lg:grid-cols-3 items-start">
          {/* Left: Latest Event Performance Table & Leaderboard (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <AdminTable
              title="Latest Event Performance"
              columns={columns}
              data={filteredEvents}
            />
            <TopEventsLeaderboard />
          </div>

          {/* Right: Recent Activity Stream (1 Col) */}
          <div className="lg:col-span-1">
            <RecentActivities />
          </div>
        </div>
      </section>

      {/* SECTION 4: Admin Tools, Reports & System Health */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Management & Reports
        </h2>
        <div className="grid gap-6 md:grid-cols-3 items-start">
          <QuickActionsPanel />
          <ReportsExportPanel />
          <SystemHealthWidget />
        </div>
      </section>
    </div>
  );
}