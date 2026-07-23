import { Badge } from "@/components/ui/badge";

export default function StatusBadge({ status }) {
  const getStatusStyle = (userStatus) => {
    switch (userStatus?.toLowerCase()) {
      case "active":
        return "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 shadow-none font-medium";
      case "inactive":
        return "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100 shadow-none font-medium";
      case "suspended":
        return "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100 shadow-none font-medium";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100 shadow-none font-medium";
    }
  };

  return (
    <Badge className={getStatusStyle(status)}>
      {status}
    </Badge>
  );
}
