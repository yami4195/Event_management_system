import { Bell,  UserCircle,   } from "lucide-react";

export default function Topbar() {
    
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200">
      <span className="text-lg font-semibold text-slate-800">Dashboard</span>

      <span className="flex items-center gap-2">
  <Bell className="h-5 w-5  text-slate-800" />
  <UserCircle className="h-5 w-5  text-slate-800" />
  <span className="text-sm font-medium text-slate-800">Admin</span>
</span>
    </header>
  );
}