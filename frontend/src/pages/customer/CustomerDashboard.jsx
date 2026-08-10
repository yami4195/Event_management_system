import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useCustomer } from "../../hooks/useCustomer";
import { Compass, Ticket, Bell, User, Calendar, MapPin, ArrowRight } from "lucide-react";
import "../../styles/components/customer-portal.css";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { loading, stats, registrations, notifications } = useCustomer();

  if (loading) {
    return (
      <div className="customer-page-container" style={{ alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3" />
        <p style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>Loading Customer Portal...</p>
      </div>
    );
  }

  const statItems = [
    { label: "Registered Events", value: stats.registeredEvents, icon: "🎫", bg: "#eff6ff", color: "#2563eb" },
    { label: "Upcoming Events", value: stats.upcomingEvents, icon: "📅", bg: "#dcfce7", color: "#16a34a" },
    { label: "Completed Events", value: stats.completedEvents, icon: "🏁", bg: "#fef3c7", color: "#d97706" },
    { label: "Unread Alerts", value: stats.unreadNotifications, icon: "🔔", bg: "#f3e8ff", color: "#9333ea" },
  ];

  return (
    <div className="customer-page-container">
      {/* Header Banner */}
      <div className="customer-banner-card">
        <div className="customer-banner-text">
          <div className="customer-pill-badge">
            <span>Attendee Account</span>
          </div>
          <h1>Welcome back, {user?.firstname || "Guest"}! 👋</h1>
          <p>
            Explore upcoming events, manage your ticket passes, and keep track of your registrations.
          </p>
        </div>

        <Link to="/events" className="btn-action-primary">
          <Compass className="w-4 h-4" />
          <span>Browse All Events</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Summary Cards Grid */}
      <div className="customer-grid-4">
        {statItems.map((item) => (
          <div key={item.label} className="customer-metric-card">
            <div className="customer-metric-icon" style={{ background: item.bg, color: item.color }}>
              {item.icon}
            </div>
            <div className="customer-metric-body">
              <span className="customer-metric-label">{item.label}</span>
              <span className="customer-metric-value">{item.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Bar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
        <Link to="/events" className="btn-action-secondary">
          <Compass className="w-4 h-4" /> Browse Events
        </Link>
        <Link to="/customer/registrations" className="btn-action-secondary">
          <Ticket className="w-4 h-4" /> My Registered Passes
        </Link>
        <Link to="/customer/notifications" className="btn-action-secondary">
          <Bell className="w-4 h-4" /> Notifications
        </Link>
        <Link to="/customer/profile" className="btn-action-secondary">
          <User className="w-4 h-4" /> My Profile
        </Link>
      </div>

      {/* Recent Passes Table Section */}
      <div className="customer-section">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "900", color: "#0f172a", margin: 0 }}>
            Recent Registered Events
          </h2>
          <Link to="/customer/registrations" style={{ fontSize: "14px", fontWeight: "800", color: "#2563eb", textDecoration: "none" }}>
            View All ({registrations.length})
          </Link>
        </div>

        {registrations.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#64748b", fontWeight: "600" }}>
            You haven't registered for any events yet. Explore events to claim your first pass!
          </div>
        ) : (
          <div className="customer-table-card">
            <div className="customer-table-wrapper">
              <table className="customer-data-table">
                <thead>
                  <tr>
                    <th>Event Details</th>
                    <th>Date & Time</th>
                    <th>Ticket Type</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.slice(0, 5).map((reg) => (
                    <tr key={reg.id || reg.registration_id}>
                      <td>
                        <div className="pass-event-cell">
                          <div className="pass-event-icon">🎫</div>
                          <div>
                            <h4 className="pass-title">{reg.event_title || reg.eventTitle}</h4>
                            <div className="pass-sub">
                              <span><MapPin className="w-3.5 h-3.5 inline mr-1" />{reg.event_location || "Venue TBA"}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>
                        {reg.event_date || reg.registrationDate || "TBA"}
                      </td>
                      <td>
                        <span style={{ padding: "4px 10px", borderRadius: "8px", background: "#eff6ff", color: "#2563eb", fontSize: "12px", fontWeight: "800" }}>
                          {reg.ticket_type || reg.ticketType || "Standard Pass"}
                        </span>
                      </td>
                      <td>
                        <span style={{ padding: "4px 10px", borderRadius: "20px", background: "#dcfce7", color: "#16a34a", fontSize: "12px", fontWeight: "800" }}>
                          {reg.status || "Confirmed"}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <Link to={`/events/${reg.event_id || reg.eventId}`} className="btn-action-secondary" style={{ height: "34px", padding: "0 14px", fontSize: "12px" }}>
                            View Pass <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
