import { useState } from "react";
import { Search, Bell, Mail, Moon, Sun, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Topbar() {
  const [searchQuery, setSearchQuery] = useState("");
const [searchVisible, setSearchVisible] = useState(true);
  return (
    <header className="flex items-center justify-between h-14 px-4 bg-white border-b border-slate-200/90 text-slate-800">
      {/* Left: Dashboard text + Search Bar beside SidebarTrigger */}
      <div className="flex items-center gap-4 flex-1">
        <span className="text-sm font-bold text-slate-900 tracking-tight shrink-0">
          Dashboard
        </span>

        {/* Search input directly beside Dashboard text */}
        <div className="relative min-w-[200px] max-w-sm flex-1 sm:flex-none">
         {searchVisible && (
      <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 pointer-events-none" />)}
          <Input
            type="text"
            placeholder="     Search pages, users, events..."
            value={searchQuery}
            onChange={(e) =>{

               setSearchQuery(e.target.value)
              setSearchVisible(e.target.value=="")
              }}
                          className="w-96 pl-8 pr-3 h-8 border-slate-200 bg-slate-50/70 hover:bg-white focus:bg-white text-xs rounded-lg shadow-2xs transition-colors"
  />
        </div>
      </div>

      {/* Right: Quick Tools (Theme, Notifications, Mail, Profile Avatar) */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          title="Toggle theme"
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Moon className="h-4 w-4" />
        </button>

        <button
          title="Notifications"
          className="relative p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        <button
          title="Messages"
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Mail className="h-4 w-4" />
        </button>

        <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />

        {/* User Profile */}
        <div className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition-colors">
          <div className="h-7 w-7 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-2xs">
            A
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 leading-tight">Admin</span>
            <span className="text-[10px] font-medium text-slate-400 leading-none">Super User</span>
          </div>
        </div>
      </div>
    </header>
  );
}