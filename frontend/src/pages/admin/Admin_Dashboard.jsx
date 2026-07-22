// src/pages/dashboard/Dashboard.jsx
import StatCard from "../../components/admin/StatCard";
import { Users, CalendarDays, Clock3, ClipboardList } from "lucide-react";

export default function Admin_Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Stat Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value="245"
          icon={Users}
          description="+12 this week"
        />
        <StatCard
          title="Total Events"
          value="38"
          icon={CalendarDays}
          description="+5 this month"
        />
        <StatCard
          title="Pending Events"
          value="7"
          icon={Clock3}
          description="Awaiting approval"
        />
        <StatCard
          title="Registrations"
          value="512"
          icon={ClipboardList}
          description="+89 this week"
        />
      </div>

      {/* Recent Events Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Events</h2>
        <div className="bg-white rounded-lg border p-6 text-slate-500">
          Recent events will appear here...
        </div>
      </div>

      {/* Recent Users Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
        <div className="bg-white rounded-lg border p-6 text-slate-500">
          Recent users will appear here...
        </div>
      </div>
    </div>
  );
}