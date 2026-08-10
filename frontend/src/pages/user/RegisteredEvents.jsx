import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { registrationsService } from "../../services/registrations.service";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { formatDate } from "../../utils/helpers";
import { ROUTES } from "../../constants/routes";
import { Compass, Ticket, Calendar, MapPin, ArrowRight } from "lucide-react";
import "../../styles/components/customer-dashboard.css";

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
      <div className="customer-portal-wrapper" style={{ alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
        <LoadingSpinner size="lg" text="Loading registered events..." />
      </div>
    );
  }

  return (
    <div className="customer-portal-wrapper">
      {/* Header Banner Card */}
      <div className="customer-hero-card">
        <div className="customer-hero-info">
          <div className="customer-badge-pill">
            <span>Ticket Passes ({registrations.length})</span>
          </div>
          <h1 className="customer-hero-title">My Registered Passes</h1>
          <p className="customer-hero-subtitle">
            View all confirmed event tickets, entry details, dates, and locations.
          </p>
        </div>

        <Link to={ROUTES.EVENTS} className="btn-hero-primary">
          <Compass className="w-5 h-5" />
          <span>Discover More Events</span>
        </Link>
      </div>

      {error ? (
        <div style={{ padding: "16px 24px", borderRadius: "16px", background: "#fef2f2", color: "#dc2626", fontWeight: "700" }}>
          {error}
        </div>
      ) : registrations.length === 0 ? (
        <div className="customer-section-card" style={{ textAlign: "center", padding: "60px 40px" }}>
          <div className="activity-badge-icon" style={{ width: "64px", height: "64px", margin: "0 auto 16px auto", borderRadius: "20px" }}>
            <Ticket className="w-8 h-8" style={{ color: "#2563eb" }} />
          </div>
          <h3 style={{ fontSize: "20px", fontWeight: "900", color: "#0f172a", margin: "0 0 8px 0" }}>
            No event passes registered yet
          </h3>
          <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 24px 0" }}>
            You have not registered for any upcoming events. Explore our directory to claim your first pass!
          </p>
          <div>
            <Link to={ROUTES.EVENTS} className="btn-hero-primary">
              <Compass className="w-5 h-5" />
              <span>Browse Events</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="customer-section-card">
          <div className="customer-card-header">
            <h2>Your Confirmed Event Passes</h2>
          </div>

          <div className="activity-feed-list">
            {registrations.map((item) => (
              <div key={`${item.user_id}-${item.event_id}`} className="activity-feed-item" style={{ alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div className="activity-badge-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="activity-feed-msg" style={{ fontSize: "16px", fontWeight: "800" }}>{item.event_title}</h4>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "4px", fontSize: "13px", color: "#64748b" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Calendar className="w-3.5 h-3.5" /> {formatDate(item.event_date)}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <MapPin className="w-3.5 h-3.5" /> {item.event_location || "Venue TBA"}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to={ROUTES.EVENT_DETAIL.replace(":id", item.event_id)}
                  className="btn-customer-quick"
                  style={{ background: "#2563eb", color: "#ffffff", border: "none" }}
                >
                  View Details <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisteredEvents;
