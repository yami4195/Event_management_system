import {
  Users,
  CalendarDays,
  Clock3,
  Ticket,
} from "lucide-react";

import StatCard from "../../components/admin/StatCard";
import AdminTable from "../../components/admin/AdminTable";

const columns = ["Title", "Organizer", "Date","Location", "Status", "Action"];

const recentEvents = [
  {
    title: "React Summit",
    organizer: "John",
    date: "July 24",
    location: "New York",
    status: "Published",
  },
  {
    title: "Flutter Meetup",
    organizer: "Sara",
    date: "July 28",
    location: "San Francisco",
    status: "Pending",
  },
  {
    title: "AI Conference",
    organizer: "Mike",
    date: "August 2",
    location: "Los Angeles",
    status: "Cancelled",
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen space-y-8 bg-slate-50 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
          <p className="mt-1 text-sm text-slate-500">
            Welcome back! Here's an overview of your platform.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <section>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Users"
            value="245"
            icon={Users}
            description="Compared to last month"
            trend={{
              value: "+5.1%",
              isPositive: true,
            }}
            variant="blue"
          />

          <StatCard
            title=" Total Events"
            value="38"
            icon={CalendarDays}
            description="Compared to last month"
            trend={{
              value: "+12%",
              isPositive: true,
            }}
            variant="indigo"
          />

          <StatCard
            title="Pending Approvals"
            value="7"
            icon={Clock3}
            description="Requires review"
            trend={{
              value: "Action Needed",
              isPositive: false,
            }}
            variant="amber"
          />

          <StatCard
            title="Registrations"
            value="512"
            icon={Ticket}
            description="Compared to last week"
            trend={{
              value: "+18%",
              isPositive: true,
            }}
            variant="emerald"
          />
        </div>
      </section>

      {/* Main Table Section */}
      <section className="grid gap-6 lg:grid-cols-1">
        <AdminTable
          title="Recent Events"
          columns={columns}
          data={recentEvents}
        />
      </section>
    </div>
  );
}