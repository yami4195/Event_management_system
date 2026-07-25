import { HardDrive, Bell, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SystemHealthWidget() {
  const notifications = [
    { label: "Pending Approvals", count: 7, color: "bg-amber-500 text-white" },
    { label: "New Registrations", count: 12, color: "bg-indigo-500 text-white" },
    { label: "Failed Payments", count: 1, color: "bg-rose-500 text-white" },
    { label: "System Health Alerts", count: 0, color: "bg-slate-200 text-slate-700" },
  ];

  return (
    <div className="space-y-4">
      {/* Notifications & Unread Badges Widget */}
      <Card className="border-slate-200/80 shadow-xs bg-white">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-indigo-600" />
              Notifications & Alerts
            </span>
            <Badge className="bg-indigo-100 text-indigo-800 text-[10px] font-bold">
              20 Unread
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3 px-4 pb-3 space-y-2">
          {notifications.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs font-semibold p-2 rounded-lg hover:bg-slate-50 border border-slate-100"
            >
              <span className="text-slate-700">{item.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${item.color}`}
              >
                {item.count}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* System Health & Storage Meter Widget (ColorLib reference style) */}
      <Card className="border-slate-200/80 shadow-xs bg-white">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-emerald-600" />
              System Storage & Health
            </span>
            <span className="text-xs font-medium text-slate-500">
              6.8 GB / 8.0 GB
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 px-4 pb-4 space-y-3">
          {/* Storage bar */}
          <div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-200/60">
              <div className="h-full bg-emerald-500 w-[50%]" title="Regular Data (4.0 GB)" />
              <div className="h-full bg-indigo-500 w-[25%]" title="System Logs (2.0 GB)" />
              <div className="h-full bg-amber-500 w-[10%]" title="Media Uploads (0.8 GB)" />
            </div>
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mt-2">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Regular: 4.0 GB
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-indigo-500" /> System: 2.0 GB
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Media: 0.8 GB
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              API Server Uptime
            </span>
            <span className="text-emerald-700 font-extrabold">99.98%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
