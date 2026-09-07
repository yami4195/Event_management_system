import { useState, useEffect, useMemo } from "react";
import {
  Users,
  CalendarDays,
  Clock3,
  DollarSign,
  Ticket,
} from "lucide-react";

import StatCard from "@/components/admin/StatCard";
import AdminTable from "@/components/admin/AdminTable";
import DateRangePicker from "@/components/admin/dashboard/DateRangePicker";
import AnalyticsChart from "@/components/admin/dashboard/AnalyticsChart";
import RecentActivities from "@/components/admin/dashboard/RecentActivities";
import TopEventsLeaderboard from "@/components/admin/dashboard/TopEventsLeaderboard";
import QuickActionsPanel from "@/components/admin/dashboard/QuickActionsPanel";
import ReportsExportPanel from "@/components/admin/dashboard/ReportsExportPanel";

import { dashboardService } from "@/services/dashboard.service";
import { eventsService } from "@/services/events.service";
import { userService } from "@/services/user.service";

const columns = ["Title", "Organizer", "Date", "Location", "Status", "Action"];

export default function Dashboard() {
  const [selectedRange, setSelectedRange] = useState("30days");
  const [globalSearch, setGlobalSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalRegistrations: 0,
    totalRevenue: 0,
    publishedEvents: 0,
    upcomingEvents: 0,
  });

  const [eventsList, setEventsList] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [statsRes, eventsRes, usersRes] = await Promise.all([
          dashboardService.getStats().catch(() => ({ data: {} })),
          eventsService.getAll().catch(() => ({ data: { data: { events: [] } } })),
          userService.getAll().catch(() => ({ data: { data: { users: [] } } })),
        ]);

        const rawStats = statsRes.data?.data || statsRes.data || {};
        const rawEvents = eventsRes.data?.data?.events || eventsRes.data?.events || [];
        const rawUsers = usersRes.data?.data?.users || usersRes.data?.users || [];

        const mappedEvents = rawEvents.map((e) => ({
          id: e.event_id || e.id,
          title: e.title || "Untitled Event",
          organizer: e.organizer_name || "Organizer",
          date: e.date ? new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBD",
          location: e.location || "Venue TBD",
          status: e.status ? e.status.charAt(0).toUpperCase() + e.status.slice(1).toLowerCase() : "Upcoming",
          attendees: Number(e.attendees) || 0,
          revenue: (Number(e.price) || 0) * (Number(e.attendees) || 0),
        }));

        setEventsList(mappedEvents);

        const totalRevenue = rawStats.totalRevenue || mappedEvents.reduce((sum, e) => sum + e.revenue, 0);

        setStats({
          totalUsers: rawUsers.length,
          totalEvents: mappedEvents.length,
          totalRegistrations: rawStats.totalRegistrations || rawStats.ticketsSold || mappedEvents.reduce((sum, e) => sum + e.attendees, 0),
          totalRevenue: totalRevenue,
          publishedEvents: rawStats.publishedEvents || mappedEvents.filter((e) => e.status === "Upcoming" || e.status === "Ongoing").length,
          upcomingEvents: rawStats.upcomingEvents || mappedEvents.filter((e) => e.status === "Upcoming").length,
        });
      } catch (err) {
        console.error("Failed to load admin dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const filteredEvents = useMemo(() => {
    return eventsList.filter((evt) => {
      if (!globalSearch) return true;
      const q = globalSearch.toLowerCase();
      return (
        evt.title.toLowerCase().includes(q) ||
        evt.organizer.toLowerCase().includes(q) ||
        evt.location.toLowerCase().includes(q)
      );
    });
  }, [eventsList, globalSearch]);

  return (
    <div className="space-y-12 text-slate-900 dark:text-slate-100 pb-24 transition-colors duration-200">
      {/* Dashboard Sub-Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Admin Overview
            </h1>
          </div>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Real-time platform metrics, live event performance, and administrative operations.
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-3 shrink-0">
          <DateRangePicker
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
          />
        </div>
      </div>

      {/* StatCards Grid */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Key Performance Indicators
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={Users}
            description="Registered accounts"
            variant="blue"
          />

          <StatCard
            title="Platform Events"
            value={stats.totalEvents.toLocaleString()}
            icon={CalendarDays}
            description={`${stats.publishedEvents} active & upcoming`}
            variant="indigo"
          />

          <StatCard
            title="Total Registrations"
            value={stats.totalRegistrations.toLocaleString()}
            icon={Ticket}
            description="Ticket passes issued"
            variant="emerald"
          />

          <StatCard
            title="Total Revenue"
            value={`ETB ${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            description="Gross event earnings"
            variant="purple"
          />
        </div>
      </section>

      {/* Performance Analytics Chart */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Revenue & Registration Trends
        </h3>
        <AnalyticsChart />
      </section>

      {/* Live Operations & Activity Feed */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Operations & Recent Activity
        </h3>
        <div className="grid gap-8 lg:grid-cols-3 items-start">
          {/* Left: Latest Event Performance Table (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <AdminTable
              title="Recent Events"
              columns={columns}
              data={filteredEvents.slice(0, 5)}
            />
            <TopEventsLeaderboard events={filteredEvents} />
          </div>

          {/* Right: Recent Activity Stream (1 Col) */}
          <div className="lg:col-span-1">
            <RecentActivities />
          </div>
        </div>
      </section>

      {/* Management & Quick Tools */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Quick Tools & Exports
        </h3>
        <div className="grid gap-6 md:grid-cols-2 items-start">
          <QuickActionsPanel />
          <ReportsExportPanel />
        </div>
      </section>
    </div>
  );
}