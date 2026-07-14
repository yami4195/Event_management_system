import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { formatDate } from "../../utils/helpers";
import "./EventCard.css";

const EventCard = ({ event }) => {
  // Use a fallback gradient if no specific background/image is provided
  const bgGradient = event.gradient || "linear-gradient(135deg, rgba(108, 99, 255, 0.1), rgba(192, 132, 252, 0.1))";
  const tagColor = event.category?.color || "#6c63ff";

  return (
    <div className="event-card" style={{ background: bgGradient }}>
      {/* Background Image handling if available */}
      {event.imageUrl && (
        <div 
          className="event-card__image-bg" 
          style={{ backgroundImage: `url(${event.imageUrl})` }} 
        />
      )}

      <div className="event-card__content">
        <div className="event-card__top">
          <span
            className="event-card__tag"
            style={{ 
              color: tagColor, 
              borderColor: `${tagColor}44`, 
              background: `${tagColor}15` 
            }}
          >
            {event.category?.name || "General"}
          </span>
          <span className="event-card__emoji">{event.emoji || "📅"}</span>
        </div>

        <h3 className="event-card__title" title={event.title}>{event.title}</h3>

        <div className="event-card__meta">
          <span>📅 {formatDate(event.date)}</span>
          <span>📍 {event.location || "Online"}</span>
          <span>👥 {event.attendees || 0} attending</span>
        </div>

        <div className="event-card__footer">
          <span className="event-card__price">
            {event.price === 0 || event.price === "Free" ? "Free" : `$${event.price}`}
          </span>
          <Link
            to={ROUTES.EVENT_DETAIL.replace(":id", event.id)}
            className="event-card__btn"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
