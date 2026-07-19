import { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get("/notifications");
        const data = res.data?.data?.notifications ?? [];
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load notifications", err);
        setError("Failed to load notifications.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <LoadingSpinner size="lg" text="Loading notifications..." />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Notifications</h1>
        <p className="dashboard-subtitle">Updates about your events and registrations.</p>
      </div>

      {error ? (
        <div className="dashboard-empty-state"><p>{error}</p></div>
      ) : notifications.length === 0 ? (
        <div className="dashboard-empty-state"><p>No notifications yet.</p></div>
      ) : (
        <div className="activity-list">
          {notifications.map((item) => (
            <div key={item.notification_id} className="activity-item">
              <div className="activity-item__content">
                <p className="activity-item__message">{item.message}</p>
                <span className="activity-item__date">
                  {item.type} · {item.is_read ? "Read" : "Unread"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
