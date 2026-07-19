import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { registrationsService } from "../../services/registrations.service";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { formatDate } from "../../utils/helpers";
import { ROUTES } from "../../constants/routes";

const RegisteredEvents = () => {
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await registrationsService.getMyRegistrations();
        const data = res.data?.data?.registrations ?? [];
        setRegistrations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load registrations", err);
        setError("Failed to load your registered events.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <LoadingSpinner size="lg" text="Loading registrations..." />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Registered Events</h1>
        <p className="dashboard-subtitle">Events you have signed up for.</p>
      </div>

      {error ? (
        <div className="dashboard-empty-state"><p>{error}</p></div>
      ) : registrations.length === 0 ? (
        <div className="dashboard-empty-state">
          <p>You have not registered for any events yet.</p>
          <Link to={ROUTES.EVENTS} className="btn btn--primary" style={{ marginTop: "1rem", display: "inline-block" }}>
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="activity-list">
          {registrations.map((item) => (
            <div key={`${item.user_id}-${item.event_id}`} className="activity-item">
              <div className="activity-item__content">
                <p className="activity-item__message">{item.event_title}</p>
                <span className="activity-item__date">
                  {formatDate(item.event_date)} · {item.event_location || "Location TBA"} · {item.status}
                </span>
                <Link to={ROUTES.EVENT_DETAIL.replace(":id", item.event_id)} className="btn btn--ghost" style={{ marginTop: "0.5rem" }}>
                  View Event
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegisteredEvents;
