import { Link } from "react-router-dom";
import { Calendar, MapPin, Ticket, Edit, Users, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDate, formatCurrency, calculatePercentage } from "../../utils/organizerHelpers";
import "../../styles/components/my-events.css";

export default function EventCard({ event, onDelete }) {
  const percentage = calculatePercentage(event.ticketsSold, event.capacity);
  const displayImage =
    event.image ||
    event.imageUrl ||
    event.image_url ||
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80";

  const rawDate = event.startDate || event.start_date || event.date;
  const isPast = Boolean(rawDate && new Date(rawDate).getTime() < Date.now());
  const effectiveStatus = isPast ? "completed" : (event.status || "upcoming");

  return (
    <div className="org-event-card">
      <div className="card-media-banner">
        <img src={displayImage} alt={event.title} loading="lazy" />
        <div className="card-badge-status-pos">
          <StatusBadge status={effectiveStatus} />
        </div>
        <div className="card-badge-price-pos">
          {event.price > 0 ? formatCurrency(event.price, event.currency) : "FREE"}
        </div>
      </div>

      <div className="card-content-body">
        <div>
          <span className="card-category-label">{event.category}</span>
          <h3 className="card-event-title">{event.title}</h3>

          <div className="card-meta-list" style={{ marginTop: "14px" }}>
            <div className="card-meta-item">
              <div className="card-meta-icon">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {formatDate(event.startDate)}
              </span>
            </div>
            <div className="card-meta-item">
              <div className="card-meta-icon" style={{ color: "#4f46e5" }}>
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {event.isOnline ? "Online Event" : event.location || "Venue TBD"}
              </span>
            </div>
          </div>
        </div>

        {/* Ticket Progress */}
        <div className="card-progress-section">
          <div className="card-progress-header">
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Ticket className="w-3.5 h-3.5" style={{ color: "#64748b" }} /> Tickets Sold
            </span>
            <span>
              {event.ticketsSold} / {event.capacity} ({percentage}%)
            </span>
          </div>
          <div className="card-progress-track">
            <div className="card-progress-bar" style={{ width: `${percentage}%` }} />
          </div>

          <div className="card-action-toolbar">
            <Link to={`/organizer/events/${event.id}/edit`} className="btn-card-edit">
              <Edit className="w-3.5 h-3.5" /> Edit
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Link to={`/organizer/registrations?eventId=${event.id}`} className="btn-card-attendees">
                <Users className="w-3.5 h-3.5" /> Attendees
              </Link>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(event)}
                  className="btn-card-delete"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
