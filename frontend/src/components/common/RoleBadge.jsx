import { Badge } from "@/components/ui/badge";

export default function RoleBadge({ role }) {
  const getRoleStyle = (userRole) => {
    switch (userRole?.toLowerCase()) {
      case "admin":
      case "administrator":
        return "bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-100 shadow-none font-medium";
      case "organizer":
        return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 shadow-none font-medium";
      case "customer":
      case "user":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 shadow-none font-medium";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100 shadow-none font-medium";
    }
  };

  return (
    <Badge className={getRoleStyle(role)}>
      {role}
    </Badge>
  );
}
