import { Link } from "react-router-dom";
import { Edit, Trash2, Users, ArrowUpDown } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDate, formatCurrency, calculatePercentage } from "../../utils/organizerHelpers";
import "../../styles/components/my-events.css";

export default function EventTable({ events = [], onDelete, sortBy, sortOrder, onSort }) {
  const handleSortClick = (field) => {
    if (!onSort) return;
    const newOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    onSort(field, newOrder);
  };

  return (
    <div className="table-card-wrapper">
      <div className="table-scrollable">
        <table className="custom-events-table">
          <thead>
            <tr>
              <th onClick={() => handleSortClick("title")} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", itemsCenter: "center", gap: "6px" }}>
                  Event Details
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th>Category</th>
              <th onClick={() => handleSortClick("date")} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", itemsCenter: "center", gap: "6px" }}>
                  Date & Time
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th>Status</th>
              <th onClick={() => handleSortClick("ticketsSold")} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", itemsCenter: "center", gap: "6px" }}>
                  Tickets Sold
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th onClick={() => handleSortClick("revenue")} style={{ cursor: "pointer", textAlign: "right" }}>
                <div style={{ display: "flex", itemsCenter: "center", justifyContent: "flex-end", gap: "6px" }}>
                  Revenue
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const pct = calculatePercentage(event.ticketsSold, event.capacity);
              const displayImage =
                event.image ||
                event.imageUrl ||
                event.image_url ||
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&auto=format&fit=crop&q=80";

              const rawDate = event.startDate || event.start_date || event.date;
              const isPast = Boolean(rawDate && new Date(rawDate).getTime() < Date.now());
              const effectiveStatus = isPast ? "completed" : (event.status || "upcoming");

              return (
                <tr key={event.id}>
                  <td>
                    <div className="table-event-info">
                      <img
                        src={displayImage}
                        alt={event.title}
                        className="table-event-thumb"
                      />
                      <div>
                        <div className="table-event-title">{event.title}</div>
                        <div className="table-event-sub">
                          {event.isOnline ? "Online Webinar" : event.location || "Venue TBD"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", background: "#f1f5f9", color: "#334155" }}>
                      {event.category}
                    </span>
                  </td>
                  <td style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>
                    {formatDate(event.startDate)}
                  </td>
                  <td>
                    <StatusBadge status={effectiveStatus} />
                  </td>
                  <td>
                    <div style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a" }}>
                      {event.ticketsSold} / {event.capacity} ({pct}%)
                    </div>
                    <div className="card-progress-track" style={{ width: "110px", marginTop: "6px" }}>
                      <div className="card-progress-bar" style={{ width: `${pct}%` }} />
                    </div>
                  </td>
                  <td style={{ textAlign: "right", fontWeight: "900", color: "#0f172a", fontSize: "15px" }}>
                    {formatCurrency(event.revenue, event.currency)}
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                      <Link to={`/organizer/events/${event.id}/edit`} className="btn-card-edit">
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <Link to={`/organizer/registrations?eventId=${event.id}`} className="btn-card-attendees">
                        <Users className="w-3.5 h-3.5" />
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
