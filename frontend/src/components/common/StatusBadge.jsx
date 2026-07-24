import { Badge } from "@/components/ui/badge";

export default function StatusBadge({ status }) {
  const getStatusStyle = (currentStatus) => {
    switch (currentStatus?.toLowerCase()) {
      case "active":
      case "published":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 shadow-none font-semibold";
      case "pending":
      case "review":
        return "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 shadow-none font-semibold";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 shadow-none font-semibold";
      case "draft":
      case "inactive":
        return "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100 shadow-none font-semibold";
      case "suspended":
      case "cancelled":
      case "canceled":
      case "rejected":
        return "bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-100 shadow-none font-semibold";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100 shadow-none font-semibold";
    }
  };

  return (
    <Badge className={getStatusStyle(status)}>
      {status}
    </Badge>
  );
}
