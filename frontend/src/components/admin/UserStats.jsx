import { Users, Building2, User, ShieldCheck } from "lucide-react";
import StatCard from "./StatCard";

export default function UserStats({ userList = [] }) {
  const totalUsers = userList.length;
  const organizers = userList.filter((u) => u.role?.toLowerCase() === "organizer").length;
  const customers = userList.filter((u) => u.role?.toLowerCase() === "customer").length;
  const admins = userList.filter((u) => u.role?.toLowerCase() === "admin").length;

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Users"
        value={totalUsers.toString()}
        icon={Users}
        description="All registered platform accounts"
        variant="blue"
      />
      <StatCard
        title="Organizers"
        value={organizers.toString()}
        icon={Building2}
        description="Event creators & managers"
        variant="indigo"
      />
      <StatCard
        title="Customers"
        value={customers.toString()}
        icon={User}
        description="Ticket buyers & attendees"
        variant="emerald"
      />
      <StatCard
        title="Administrators"
        value={admins.toString()}
        icon={ShieldCheck}
        description="Platform moderators"
        variant="purple"
      />
    </div>
  );
}
