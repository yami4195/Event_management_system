import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  Sparkles,
  LogOut,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function OrganizerSidebar({ isCollapsed, onToggleCollapse, isMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const navItems = [
    { label: "Dashboard", path: "/dashboard/organizer", icon: LayoutDashboard },
    { label: "My Events", path: "/organizer/events", icon: Calendar },
    { label: "Create Event", path: "/organizer/events/create", icon: PlusCircle },
    { label: "Registrations", path: "/organizer/registrations", icon: Users },
    { label: "Analytics", path: "/organizer/analytics", icon: BarChart3 },
    { label: "Settings", path: "/organizer/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      if (logout) await logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <aside
      className={`organizer-sidebar-shell ${
        isCollapsed ? "organizer-sidebar-shell--collapsed" : ""
      } ${isMobileOpen ? "organizer-sidebar-shell--open" : ""}`}
    >
      <div className="sidebar-brand">
        <Link to="/" className="sidebar-brand-logo">
          <div className="sidebar-brand-icon">E</div>
          {!isCollapsed && <span>EventFlow</span>}
        </Link>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-800 items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      <div className="sidebar-nav-container">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${isActive ? "sidebar-nav-item--active" : ""}`}
              title={isCollapsed ? item.label : ""}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        {/* Logout Button in Navigation */}
        <button
          type="button"
          onClick={handleLogout}
          className="sidebar-nav-item text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 w-full text-left mt-auto font-bold"
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      {!isCollapsed && (
        <div className="sidebar-footer">
          <div className="organizer-profile-pill justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <Sparkles className="w-5 h-5 text-black dark:text-white shrink-0" />
              <div className="text-xs truncate">
                <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
                  {user?.name || "Verified Organizer"}
                </div>
                <div className="text-slate-500 truncate">{user?.email || "TechHub Addis"}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
