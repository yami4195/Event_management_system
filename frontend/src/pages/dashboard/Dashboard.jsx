import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { dashboardService } from "../../services";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { ROUTES } from "../../constants/routes";
import { ORGANIZER_ROLES } from "../../constants/roles";
import { Compass, Ticket, Bell, User, Calendar, ArrowRight } from "lucide-react";
import "../../styles/components/customer-dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const isOrganizer = ORGANIZER_ROLES.includes(user?.role);
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentActivity(),
        ]);
        setStats(statsRes.data);
        setActivity(Array.isArray(activityRes.data) ? activityRes.data : []);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
        setError("Failed to load dashboard metrics. Please refresh.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="customer-portal-wrapper" style={{ alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
        <LoadingSpinner size="lg" text="Loading Customer Portal..." />
      </div>
    );
  }

  const customerStats = [
    { label: "Registered Events", value: stats?.registeredEvents ?? 0, icon: "🎫", bg: "#eff6ff", color: "#2563eb" },
    { label: "Upcoming Events", value: stats?.upcomingEvents ?? 0, icon: "📅", bg: "#dcfce7", color: "#16a34a" },
    { label: "Completed Events", value: stats?.completedEvents ?? 0, icon: "🏁", bg: "#fef3c7", color: "#d97706" },
    { label: "Unread Alerts", value: stats?.unreadNotifications ?? 0, icon: "🔔", bg: "#f3e8ff", color: "#9333ea" },
  ];

  return (
    <div className="customer-portal-wrapper">
      {/* Hero Welcome Card */}
      <div className="customer-hero-card">
        <div className="customer-hero-info">
          <div className="customer-badge-pill">
            <span>Customer Portal</span>
          </div>
          <h1 className="customer-hero-title">Welcome back, {user?.firstname || "Friend"}! 👋</h1>
          <p className="customer-hero-subtitle">
            Track your ticket passes, explore exciting upcoming conferences & gathering events, and check your activity log.
          </p>
        </div>

        <Link to={ROUTES.EVENTS} className="btn-hero-primary">
          <Compass className="w-5 h-5" />
          <span>Browse Events</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {error && (
        <div style={{ padding: "16px 24px", borderRadius: "16px", background: "#fef2f2", color: "#dc2626", fontWeight: "700", fontSize: "14px" }}>
          {error}
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="customer-stats-grid">
        {customerStats.map((card) => (
          <div key={card.label} className="customer-stat-card">
            <div className="customer-stat-icon-wrap" style={{ background: card.bg, color: card.color }}>
              {card.icon}
            </div>
            <div className="customer-stat-content">
              <span className="customer-stat-label">{card.label}</span>
              <span className="customer-stat-val">{card.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Navigation Toolbar */}
      <div className="customer-quick-toolbar">
        <Link to={ROUTES.EVENTS} className="btn-customer-quick">
          <Compass className="w-4 h-4" /> Browse Events
        </Link>
        <Link to={ROUTES.REGISTERED_EVENTS} className="btn-customer-quick">
          <Ticket className="w-4 h-4" /> My Registered Passes
        </Link>
        <Link to={ROUTES.NOTIFICATIONS} className="btn-customer-quick">
          <Bell className="w-4 h-4" /> Notifications
        </Link>
        <Link to={ROUTES.PROFILE} className="btn-customer-quick">
          <User className="w-4 h-4" /> My Profile
        </Link>
      </div>

      {/* Recent Activity Timeline */}
      <div className="customer-section-card">
        <div className="customer-card-header">
          <h2>Recent Activity & Ticket Logs</h2>
        </div>

        {activity.length > 0 ? (
          <div className="activity-feed-list">
            {activity.map((item) => (
              <div key={item.id} className="activity-feed-item">
                <div className="activity-badge-icon">
                  {item.type === "REGISTRATION" && "📝"}
                  {item.type === "PAYMENT" && "💳"}
                  {item.type === "EVENT_UPDATE" && "🔄"}
                  {item.type === "NOTIFICATION" && "🔔"}
                </div>
                <div className="activity-feed-body">
                  <p className="activity-feed-msg">{item.message}</p>
                  <span className="activity-feed-time">{formatDate(item.date)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748b", fontWeight: "600" }}>
            No recent activity found. Explore events to register for your first pass!
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
