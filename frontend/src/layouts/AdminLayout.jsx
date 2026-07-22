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

      <SidebarInset className="bg-slate-100">
        <div className="flex items-center border-b border-slate-200 bg-white text-slate-800">
          <SidebarTrigger className="ml-2 " />
          <div className="flex-1">
            <Topbar />
          </div>
        </div>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}