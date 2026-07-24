import { CalendarDays, Globe, Clock3, Ban } from "lucide-react";
import StatCard from "./StatCard";

export default function EventStats({ eventList = [] }) {
  const totalEvents = eventList.length;
  const published = eventList.filter((e) => e.status?.toLowerCase() === "published").length;
  const pending = eventList.filter((e) => e.status?.toLowerCase() === "pending").length;
  const cancelled = eventList.filter(
    (e) => e.status?.toLowerCase() === "cancelled" || e.status?.toLowerCase() === "canceled"
  ).length;

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Events"
        value={totalEvents.toString()}
        icon={CalendarDays}
        description="Platform total events"
        variant="blue"
      />
      <StatCard
        title="Published"
        value={published.toString()}
        icon={Globe}
        description="Live & active on site"
        variant="emerald"
      />
      <StatCard
        title="Pending Review"
        value={pending.toString()}
        icon={Clock3}
        description="Awaiting moderation"
        variant="amber"
      />
      <StatCard
        title="Cancelled"
        value={cancelled.toString()}
        icon={Ban}
        description="Cancelled or rejected"
        variant="purple"
      />
    </div>
  );
}
