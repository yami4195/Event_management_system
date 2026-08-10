import { useCustomer } from "../../hooks/useCustomer";
import { Bell, CheckCircle2, AlertCircle, Info, Calendar } from "lucide-react";
import "../../styles/components/customer-portal.css";

export default function CustomerNotifications() {
  const { notifications, markNotificationRead } = useCustomer();

  return (
    <div className="customer-page-container">
      {/* Header Banner */}
      <div className="customer-banner-card">
        <div className="customer-banner-text">
          <div className="customer-pill-badge">
            <span>Account Alerts</span>
          </div>
          <h1>Account & Ticket Notifications</h1>
          <p>Stay updated on event schedules, venue changes, registration confirmations, and reminders.</p>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="customer-section">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "900", color: "#0f172a", margin: 0 }}>
            Recent Activity Alerts ({notifications.length})
          </h2>
        </div>

        {notifications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 40px", color: "#64748b", fontWeight: "600" }}>
            <Bell className="w-12 h-12" style={{ color: "#94a3b8", margin: "0 auto 16px auto" }} />
            <p style={{ margin: 0 }}>You have no notifications at this time.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  background: n.read ? "#ffffff" : "#eff6ff",
                  border: n.read ? "1px solid #e2e8f0" : "1.5px solid #bfdbfe",
                  borderRadius: "20px",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "20px",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "14px",
                      background: n.read ? "#f1f5f9" : "#ffffff",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#2563eb",
                      flexShrink: 0,
                    }}
                  >
                    <Bell className="w-5 h-5" />
                  </div>

                  <div>
                    <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0" }}>
                      {n.title}
                    </h4>
                    <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 8px 0", lineHeight: 1.4 }}>
                      {n.message}
                    </p>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8" }}>
                      {n.timestamp}
                    </span>
                  </div>
                </div>

                {!n.read && (
                  <button
                    type="button"
                    onClick={() => markNotificationRead(n.id)}
                    className="btn-action-secondary"
                    style={{ height: "34px", padding: "0 12px", fontSize: "12px", whiteSpace: "nowrap" }}
                  >
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
