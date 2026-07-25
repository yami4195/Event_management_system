import { Outlet } from "react-router-dom";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";

import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <Sidebar />

      <SidebarInset className="bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <div className="flex items-center gap-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-200">
          <SidebarTrigger className="ml-2" />
          <div className="flex-1">
            <Topbar />
          </div>
        </div>

        <main className="flex-1 px-6 py-25 text-slate-900 dark:text-slate-100 transition-colors duration-200">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}