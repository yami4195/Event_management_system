import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { dashboardService } from "../../services";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { ROUTES } from "../../constants/routes";
import { ORGANIZER_ROLES } from "../../constants/roles";
import "./Dashboard.css";

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
        setError("Failed to load dashboard data. Please try again later.");
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
      <div className="dashboard-loading">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const organizerStats = [
    { label: "Total Events", value: stats?.totalEvents ?? 0, icon: "🎫", color: "#6c63ff" },
    { label: "Published Events", value: stats?.publishedEvents ?? 0, icon: "📢", color: "#43e97b" },
    { label: "Upcoming Events", value: stats?.upcomingEvents ?? 0, icon: "📅", color: "#ffa600" },
    { label: "Cancelled Events", value: stats?.cancelledEvents ?? 0, icon: "⛔", color: "#ff6584" },
    { label: "Total Registrations", value: stats?.totalRegistrations ?? 0, icon: "✅", color: "#6c63ff" },
  ];

  const customerStats = [
    { label: "Registered Events", value: stats?.registeredEvents ?? 0, icon: "🎫", color: "#6c63ff" },
    { label: "Upcoming Events", value: stats?.upcomingEvents ?? 0, icon: "📅", color: "#43e97b" },
    { label: "Completed Events", value: stats?.completedEvents ?? 0, icon: "🏁", color: "#ffa600" },
    { label: "Unread Notifications", value: stats?.unreadNotifications ?? 0, icon: "🔔", color: "#ff6584" },
  ];

  const statCards = isOrganizer ? organizerStats : customerStats;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome back {user?.firstname}!</h1>
        <p className="dashboard-subtitle">
          {isOrganizer
            ? "Manage your events and track registrations."
            : "Browse events and keep track of your registrations."}
        </p>
      </div>

      {error && (
        <div className="dashboard-empty-state" style={{ marginBottom: "2rem", borderStyle: "solid" }}>
          <p>{error}</p>
        </div>
      )}

      <div className="dashboard-stats-grid">
        {statCards.map((card) => (
          <div key={card.label} className="stat-card">
            <div
              className="stat-card__icon"
              style={{ background: `${card.color}26`, color: card.color }}
            >
              {card.icon}
            </div>
            <div className="stat-card__content">
              <span className="stat-card__label">{card.label}</span>
              <span className="stat-card__value">{card.value}</span>
            </div>
          </div>
        ))}
      </div>

      {!isOrganizer && (
        <div className="dashboard-quick-links" style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <Link to={ROUTES.EVENTS} className="btn btn--outline">Browse Events</Link>
          <Link to={ROUTES.REGISTERED_EVENTS} className="btn btn--outline">Registered Events</Link>
          <Link to={ROUTES.NOTIFICATIONS} className="btn btn--outline">Notifications</Link>
        </div>
      )}

      {isOrganizer && (
        <div className="dashboard-quick-links" style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <Link to={ROUTES.MANAGE_EVENTS} className="btn btn--outline">My Events</Link>
          <Link to={ROUTES.CREATE_EVENT} className="btn btn--primary">Create Event</Link>
        </div>
      )}

      <div className="dashboard-recent">
        <h2>Recent Activity</h2>
        {activity.length > 0 ? (
          <div className="activity-list">
            {activity.map((item) => (
              <div key={item.id} className="activity-item">
                <div className={`activity-item__icon activity-item__icon--${item.type.toLowerCase()}`}>
                  {item.type === "REGISTRATION" && "📝"}
                  {item.type === "PAYMENT" && "💳"}
                  {item.type === "EVENT_UPDATE" && "🔄"}
                  {item.type === "NOTIFICATION" && "🔔"}
                </div>
                <div className="activity-item__content">
                  <p className="activity-item__message">{item.message}</p>
                  <span className="activity-item__date">{formatDate(item.date)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dashboard-empty-state">
            <p>No recent activity found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
