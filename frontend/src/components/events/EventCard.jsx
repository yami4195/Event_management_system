import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { formatDate } from "../../utils/helpers";
import "./EventCard.css";

const EventCard = ({ event }) => {
  const displayImage = event.imageUrl;
  const isFree = event.price === 0 || event.price === "Free" || !event.price;
  const eventId = event.event_id || event.id;
  const remainingSeats =
    event.capacity != null ? Math.max(event.capacity - (event.attendees || 0), 0) : null;
  const isSoldOut = remainingSeats !== null && remainingSeats <= 0;

  return (
    <div className="intl-card">
      <div className="intl-card__media">
        {displayImage ? (
          <img src={displayImage} alt={event.title} className="intl-card__img" />
        ) : (
          <div
            className="intl-card__img"
            style={{
              background: "linear-gradient(135deg, rgba(108, 99, 255, 0.3), rgba(192, 132, 252, 0.3))",
              height: "100%",
              width: "100%",
            }}
          />
        )}
        <div className="intl-card__badges">
          <span className="intl-card__tag">
            {event.category_name || "Uncategorized"}
          </span>
          {remainingSeats !== null && (
            <span className="intl-card__status-tag">
              {isSoldOut ? "Sold Out" : `${remainingSeats} seats left`}
            </span>
          )}
        </div>
      </div>

      <div className="intl-card__body">
        <h3 className="intl-card__title" title={event.title}>
          {event.title}
        </h3>

        <div className="intl-card__grid">
          <div className="intl-card__grid-item">
            <span className="intl-card__icon">📅</span>
            <span>{formatDate(event.date)}{event.time ? ` · ${event.time}` : ""}</span>
          </div>
          <div className="intl-card__grid-item">
            <span className="intl-card__icon">📍</span>
            <span className="intl-card__truncate">{event.location || "Location TBA"}</span>
          </div>
          {event.organizer_name && (
            <div className="intl-card__grid-item">
              <span className="intl-card__icon">👤</span>
              <span className="intl-card__truncate">{event.organizer_name}</span>
            </div>
          )}
        </div>

        <p className="intl-card__description">
          {event.description || "No description provided."}
        </p>

        <div className="intl-card__footer">
          <div className="intl-card__price-wrapper">
            <span className="intl-card__price-label">Registration Fee</span>
            <span className="intl-card__price-value">{isFree ? "Free" : `$${event.price}`}</span>
          </div>

          <Link
            to={ROUTES.EVENT_DETAIL.replace(":id", eventId)}
            className="intl-card__btn"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
