import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Bell, User, Compass, LogOut } from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function CustomerNavbar({ onToggleSidebar, notifications = [], title = "Customer Portal" }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const unreadCount = notifications.filter((n) => !n.read).length;

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
    <header className="customer-navbar">
      <div className="customer-navbar-left">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="btn-navbar-menu"
          title="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="customer-navbar-title">{title}</h1>
      </div>

      <div className="customer-navbar-right">
        {/* Quick Browse Events CTA */}
        <Link to="/events" className="btn-navbar-cta">
          <Compass className="w-4 h-4" />
          <span>Browse Events</span>
        </Link>

        {/* Notifications Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn-navbar-bell"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && <span className="bell-unread-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div
              style={{
                position: "absolute",
                right: 0,
                marginTop: "12px",
                width: "320px",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "20px",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.1)",
                padding: "20px",
                zIndex: 50,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9", marginBottom: "12px" }}>
                <span style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>Customer Notifications</span>
                <span style={{ fontSize: "12px", fontWeight: "800", color: "#2563eb" }}>{unreadCount} unread</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "250px", overflowY: "auto" }}>
                {notifications.length === 0 ? (
                  <p style={{ fontSize: "13px", color: "#94a3b8", textAlign: "center", margin: "16px 0" }}>No notifications yet</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        padding: "12px",
                        borderRadius: "12px",
                        background: n.read ? "#f8fafc" : "#eff6ff",
                        border: n.read ? "1px solid #f1f5f9" : "1px solid #dbeafe",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      <div style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a" }}>{n.title}</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>{n.message}</div>
                      <span style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8" }}>{n.timestamp}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Link */}
        <Link to="/customer/profile" title="Customer Profile" style={{ textDecoration: "none" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "#2563eb",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "900",
              fontSize: "15px",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
            }}
          >
            {user?.firstname?.[0]?.toUpperCase() || <User className="w-5 h-5" />}
          </div>
        </Link>
      </div>
    </header>
  );
}
