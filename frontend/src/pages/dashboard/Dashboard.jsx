import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { dashboardService } from "../../services";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentActivity(),
        ]);
        setStats(statsRes.data);
        setActivity(activityRes.data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome back, {user?.firstname}! 👋</h1>
        <p className="dashboard-subtitle">Here's an overview of your activity.</p>
      </div>

      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <div className="stat-card__icon" style={{ background: "rgba(108, 99, 255, 0.15)", color: "#6c63ff" }}>🎫</div>
          <div className="stat-card__content">
            <span className="stat-card__label">Total Events</span>
            <span className="stat-card__value">{stats?.totalEvents || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon" style={{ background: "rgba(67, 233, 123, 0.15)", color: "#43e97b" }}>📅</div>
          <div className="stat-card__content">
            <span className="stat-card__label">Upcoming Events</span>
            <span className="stat-card__value">{stats?.upcomingEvents || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon" style={{ background: "rgba(255, 101, 132, 0.15)", color: "#ff6584" }}>✅</div>
          <div className="stat-card__content">
            <span className="stat-card__label">Registered Events</span>
            <span className="stat-card__value">{stats?.registeredEvents || 0}</span>
          </div>
        </div>
      </div>
      
      <div className="dashboard-recent">
        <h2>Recent Activity</h2>
        {activity && activity.length > 0 ? (
          <div className="activity-list">
            {activity.map((item) => (
              <div key={item.id} className="activity-item">
                <div className={`activity-item__icon activity-item__icon--${item.type.toLowerCase()}`}>
                  {item.type === "REGISTRATION" && "📝"}
                  {item.type === "PAYMENT" && "💳"}
                  {item.type === "EVENT_UPDATE" && "🔄"}
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