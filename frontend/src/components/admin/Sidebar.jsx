import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../ui/sidebar";

import {
  Settings,
  LogOut,
  ShieldCheck,
  CalendarDays,
  Users,
  LayoutDashboard,
  Tag,
  ClipboardList,
  MessageSquare,
  Bell,
  BarChart3,
 
} from "lucide-react";

const menuItems = [
  { title: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { title: "Users", path: "/admin/users", icon: Users },
  { title: "Events", path: "/admin/events", icon: CalendarDays },
  { title: "Categories", path: "/admin/categories", icon: Tag },
  { title: "Registrations", path: "/admin/registrations", icon:   ClipboardList }, 
  { title: "Feedback", path: "/admin/feedback", icon: MessageSquare  },
  { title: "Notifications", path: "/admin/notifications", icon: Bell },
  { title: "Analytics", path: "/admin/analytics", icon: BarChart3},
  { title: "Settings", path: "/admin/settings", icon: Settings},
  { title: "Logout", path: "/admin/logout", icon: LogOut },
];

export default function AppSidebar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Sidebar>
      {/* Branding */}
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">EMS Admin</span>
        </div>
      </SidebarHeader>

      {/* Nav links */}
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map(({ title, path, icon: Icon }) => (
            <SidebarMenuItem key={path}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={path}
                  end={path === "/admin"}
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* Admin info + logout */}
      <SidebarFooter>
        <div className="flex items-center justify-between px-2 py-3 border-t">
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium truncate">
              {user?.name ?? "Admin"}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {user?.email}
            </span>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded hover:bg-destructive/10 text-destructive"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}