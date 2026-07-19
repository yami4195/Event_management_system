import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import { eventsService } from "../../services";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { formatDate } from "../../utils/helpers";
import "./MyEvents.css";

const MyEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await eventsService.getAll({ organizerId: user?.id });
        const data = res.data?.data || res.data || [];
        const items = Array.isArray(data) ? data : (data.events || []);
        
        setEvents(items);
      } catch (err) {
        console.error("Failed to fetch my events", err);
        setError("Failed to load your events. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyEvents();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    try {
      await eventsService.delete(id);
      setEvents(prev => prev.filter(e => (e.event_id || e.id) !== id));
    } catch (err) {
      console.error("Delete failed via API", err);
      alert("Failed to delete event. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header my-events__header">
        <div>
          <h1 className="dashboard-title">My Events</h1>
          <p className="dashboard-subtitle">Manage the events you are organizing.</p>
        </div>
        <Link to="/events/create" className="btn btn--primary">
          <FiPlus /> Create Event
        </Link>
      </div>

      {isLoading ? (
        <div style={{ minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="events-empty">
          <p>{error}</p>
        </div>
      ) : events.length === 0 ? (
        <div className="events-empty">
          <div className="events-empty__icon">📅</div>
          <h3>No events yet</h3>
          <p className="events-empty__text">You haven't created any events yet. Get started by creating your first event!</p>
          <Link to="/events/create" className="btn btn--primary">Create Event</Link>
        </div>
      ) : (
        <div className="my-events__table-container">
          <table className="my-events__table">
            <thead>
              <tr>
                <th>Event Details</th>
                <th>Date</th>
                <th>Attendees</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => {
                const eventId = event.event_id || event.id;
                return (
                  <tr key={eventId}>
                    <td>
                      <div className="my-events__title">{event.title}</div>
                    </td>
                    <td>{formatDate(event.date)}</td>
                    <td>
                      <span className="my-events__badge">{event.attendees || 0}</span>
                    </td>
                    <td>
                      <span className={`status-dot ${event.status === 'Draft' ? 'status-dot--draft' : 'status-dot--active'}`} />
                      {event.status || 'Published'}
                    </td>
                    <td>
                      <div className="my-events__actions text-right">
                        <Link to={`/events/${eventId}`} className="action-btn" title="View Public Page">
                          <FiExternalLink />
                        </Link>
                        <Link to={`/events/${eventId}/edit`} className="action-btn" title="Edit Event">
                          <FiEdit2 />
                        </Link>
                        <button
                          className="action-btn action-btn--danger"
                          title="Delete Event"
                          onClick={() => handleDelete(eventId)}
                          disabled={deletingId === eventId}
                        >
                          {deletingId === eventId ? <span className="spinner-border spinner-border-sm" style={{ width: '14px', height: '14px', borderWidth: '2px' }} /> : <FiTrash2 />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
