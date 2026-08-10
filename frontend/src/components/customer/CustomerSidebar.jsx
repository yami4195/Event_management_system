import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  Ticket,
  Bell,
  User,
  ChevronLeft,
  LogOut,
  Sparkles,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function CustomerSidebar({ isCollapsed, onToggleCollapse, isMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const navItems = [
    { label: "Dashboard", path: "/dashboard/customer", icon: LayoutDashboard },
    { label: "Browse Events", path: "/events", icon: Compass },
    { label: "My Registered Events", path: "/customer/registrations", icon: Ticket },
    { label: "Notifications", path: "/customer/notifications", icon: Bell },
    { label: "My Profile", path: "/customer/profile", icon: User },
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
      className={`customer-sidebar-shell ${
        isCollapsed ? "customer-sidebar-shell--collapsed" : ""
      } ${isMobileOpen ? "customer-sidebar-shell--open" : ""}`}
    >
      <div className="customer-sidebar-brand">
        <Link to="/" className="customer-sidebar-brand-logo">
          <div className="customer-sidebar-brand-icon">E</div>
          {!isCollapsed && <span>EventFlow</span>}
        </Link>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="btn-sidebar-collapse"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      <nav className="customer-sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`customer-nav-item ${isActive ? "customer-nav-item--active" : ""}`}
              title={isCollapsed ? item.label : ""}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={handleLogout}
          className="customer-nav-item customer-nav-item--logout"
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </nav>

      {!isCollapsed && (
        <div className="customer-sidebar-footer">
          <div className="customer-user-pill">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
              <div className="customer-user-avatar">
                {user?.firstname?.[0]?.toUpperCase() || "C"}
              </div>
              <div className="customer-user-details">
                <span className="customer-user-name">{user?.firstname} {user?.lastname}</span>
                <span className="customer-user-role">Attendee Account</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
