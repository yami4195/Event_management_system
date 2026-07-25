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
      color: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border-indigo-200 dark:border-indigo-800",
    },
    {
      label: "Add Organizer",
      icon: UserPlus,
      path: "/admin/users",
      color: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-800",
    },
    {
      label: "Approve Events",
      icon: CheckSquare,
      path: "/admin/events",
      color: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border-emerald-200 dark:border-emerald-800",
    },
    {
      label: "Create Category",
      icon: FolderPlus,
      path: "/admin/categories",
      color: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 border-purple-200 dark:border-purple-800",
    },
    {
      label: "Send Notification",
      icon: Bell,
      path: "/admin/notifications",
      color: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 border-amber-200 dark:border-amber-800",
    },
    {
      label: "View Reports",
      icon: FileText,
      path: "/admin/analytics",
      color: "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700",
    },
  ];

  return (
    <Card className="border-slate-200/80 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Zap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
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
