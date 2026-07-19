import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { formatDate } from "../../utils/helpers";
import "./EventCard.css";

const EventCard = ({ event }) => {
  // Safe defaults for image fallback and capacity calculations
  const displayImage = event.imageUrl;
  const isFree = event.price === 0 || event.price === "Free" || !event.price;
  
  // Identify correct ID (postgres backend returns event_id)
  const eventId = event.event_id || event.id;
  
  // Custom international specific variables
  const languages = event.languages || "English (Interpretation Available)";
  const timezone = event.time ? `${event.time} UTC` : "TBD";

  return (
    <div className="intl-card">
      {/* 1. Header Media Region */}
      <div className="intl-card__media">
        {displayImage ? (
          <img src={displayImage} alt={event.title} className="intl-card__img" />
        ) : (
          <div className="intl-card__img" style={{ background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.3), rgba(192, 132, 252, 0.3))', height: '100%', width: '100%' }} />
        )}
        <div className="intl-card__badges">
          <span className="intl-card__tag">
            {event.category_name || event.category?.name || "Global Event"}
          </span>
          {event.capacity && (
            <span className="intl-card__status-tag">
              Tickets Available
            </span>
          )}
        </div>
      </div>

      {/* 2. Main Content Body */}
      <div className="intl-card__body">
        <h3 className="intl-card__title" title={event.title}>
          {event.title}
        </h3>

        {/* 3. Localized Time & Place Grid */}
        <div className="intl-card__grid">
          <div className="intl-card__grid-item">
            <span className="intl-card__icon">📅</span>
            <span>{formatDate(event.date)} | {timezone}</span>
          </div>
          <div className="intl-card__grid-item">
            <span className="intl-card__icon">📍</span>
            <span className="intl-card__truncate">{event.location || "Global/Hybrid"}</span>
          </div>
        </div>

        <p className="intl-card__description">
          {event.description || "No description provided for this global session."}
        </p>

        {/* 4. Custom International Specifics Section */}
        <div className="intl-card__specifics">
          <h4 className="intl-card__specifics-heading">International Specifics</h4>
          <div className="intl-card__specifics-row">
            <span className="intl-card__icon">🌐</span>
            <p>{languages}</p>
          </div>
          <div className="intl-card__specifics-row">
            <span className="intl-card__icon">🛡️</span>
            <p>Visa Support &amp; Venue info available upon setup</p>
          </div>
        </div>

        {/* 5. Pricing and CTA Action Footer */}
        <div className="intl-card__footer">
          <div className="intl-card__price-wrapper">
            <span className="intl-card__price-label">Registration Fee</span>
            <span className="intl-card__price-value">{isFree ? "Free" : `$${event.price}`}</span>
          </div>
          
          <Link
            to={ROUTES.EVENT_DETAIL.replace(":id", eventId)}
            className="intl-card__btn"
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;