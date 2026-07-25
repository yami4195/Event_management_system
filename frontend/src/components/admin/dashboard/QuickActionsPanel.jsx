import { Plus, UserPlus, CheckSquare, FolderPlus, Bell, FileText, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function QuickActionsPanel() {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Add Event",
      icon: Plus,
      path: "/admin/events",
      color: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200",
    },
    {
      label: "Add Organizer",
      icon: UserPlus,
      path: "/admin/users",
      color: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200",
    },
    {
      label: "Approve Events",
      icon: CheckSquare,
      path: "/admin/events",
      color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200",
    },
    {
      label: "Create Category",
      icon: FolderPlus,
      path: "/admin/categories",
      color: "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200",
    },
    {
      label: "Send Notification",
      icon: Bell,
      path: "/admin/notifications",
      color: "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200",
    },
    {
      label: "View Reports",
      icon: FileText,
      path: "/admin/analytics",
      color: "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200",
    },
  ];

  return (
    <Card className="border-slate-200/80 shadow-xs bg-white">
      <CardHeader className="border-b border-slate-100 pb-3">
        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Zap className="h-4 w-4 text-indigo-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3 px-3 pb-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {actions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <Button
                key={idx}
                variant="outline"
                onClick={() => navigate(act.path)}
                className={`flex flex-col items-center justify-center h-20 p-2 gap-1.5 rounded-xl border transition-all text-xs font-bold ${act.color}`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate max-w-full">{act.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
