import { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Ticket,
  Users,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { eventsService } from "@/services/events.service";
import { categoriesService } from "@/services/category.service";
import { userService } from "@/services/user.service";
import StatCard from "@/components/admin/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Analytics() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      setLoading(true);
      try {
        const [eventsRes, catsRes, usersRes] = await Promise.all([
          eventsService.getAll().catch(() => ({ data: { data: { events: [] } } })),
          categoriesService.getAll().catch(() => ({ data: { data: { categories: [] } } })),
          userService.getAll().catch(() => ({ data: { data: { users: [] } } })),
        ]);

        setEvents(eventsRes.data?.data?.events || eventsRes.data?.events || []);
        setCategories(catsRes.data?.data?.categories || catsRes.data?.categories || []);
        setUsers(usersRes.data?.data?.users || usersRes.data?.users || []);
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  const totalTicketsSold = events.reduce((sum, e) => sum + (Number(e.attendees) || 0), 0);
  const totalGrossRevenue = events.reduce((sum, e) => sum + (Number(e.price) || 0) * (Number(e.attendees) || 0), 0);
  const totalCapacity = events.reduce((sum, e) => sum + (Number(e.capacity) || 0), 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((totalTicketsSold / totalCapacity) * 100) : 0;

  // Category distribution
  const categoryCounts = categories.map((cat) => {
    const matchedEvents = events.filter((e) => (e.category_name || "").toLowerCase() === (cat.name || "").toLowerCase());
    const count = matchedEvents.length;
    const attendees = matchedEvents.reduce((acc, ev) => acc + (Number(ev.attendees) || 0), 0);
    return {
      name: cat.name,
      eventsCount: count,
      attendees,
      percentage: events.length > 0 ? Math.round((count / events.length) * 100) : 0,
    };
  });

  // Top events by attendance
  const topEvents = [...events]
    .sort((a, b) => (Number(b.attendees) || 0) - (Number(a.attendees) || 0))
    .slice(0, 5);

  return (
    <div className="min-h-screen space-y-8 bg-slate-50 p-6 lg:p-8 text-slate-900">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Platform Analytics & Insights
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Gross revenue generated, attendance conversion metrics, and category engagement reports.
          </p>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Gross Revenue"
          value={`ETB ${totalGrossRevenue.toLocaleString()}`}
          icon={DollarSign}
          description="Total ticket transactions"
          trend={{ value: "+15.8%", isPositive: true }}
          variant="purple"
        />
        <StatCard
          title="Tickets Claimed"
          value={totalTicketsSold.toLocaleString()}
          icon={Ticket}
          description="Confirmed registrations"
          trend={{ value: "+22.4%", isPositive: true }}
          variant="emerald"
        />
        <StatCard
          title="Capacity Occupancy"
          value={`${occupancyRate}%`}
          icon={TrendingUp}
          description="Average seat fill rate"
          variant="blue"
        />
        <StatCard
          title="Registered Accounts"
          value={users.length.toString()}
          icon={Users}
          description="Platform members"
          variant="indigo"
        />
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid gap-8 lg:grid-cols-2 items-start">
        {/* Category Breakdown */}
        <Card className="border-slate-200/80 shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-600" />
              Event Category Distribution
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {categoryCounts.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800">{cat.name}</span>
                  <span className="text-xs text-slate-500 font-medium">
                    {cat.eventsCount} events ({cat.percentage}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Performing Events Leaderboard */}
        <Card className="border-slate-200/80 shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Top Events by Attendance
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            {topEvents.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">No event attendance data yet.</p>
            ) : (
              <div className="space-y-3">
                {topEvents.map((evt, idx) => (
                  <div
                    key={evt.event_id || idx}
                    className="flex items-center justify-between p-3.5 rounded-lg border border-slate-100 bg-white hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 font-bold text-xs text-indigo-700">
                        #{idx + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{evt.title}</p>
                        <span className="text-xs text-slate-400">
                          {evt.category_name || "General"} • {evt.location || "Venue TBD"}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-800">
                        {evt.attendees || 0} attendees
                      </span>
                      <span className="block text-xs text-slate-400">
                        ETB {((Number(evt.price) || 0) * (Number(evt.attendees) || 0)).toLocaleString()} rev
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}