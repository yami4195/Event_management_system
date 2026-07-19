import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { FiCalendar, FiMapPin, FiUser, FiShare2, FiArrowLeft, FiTag } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import { eventsService } from "../../services";
import { registrationsService } from "../../services/registrations.service";
import { formatDate } from "../../utils/helpers";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { ORGANIZER_ROLES } from "../../constants/roles";
import "./EventDetails.css";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const canRegister = isAuthenticated && !ORGANIZER_ROLES.includes(user?.role);

  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await eventsService.getById(id);
        const data = res.data?.data?.event || res.data?.data || res.data;
        if (data) {
          setEvent(data);
        } else {
          setError("Event not found.");
        }
      } catch (err) {
        console.error("Failed to fetch event:", err);
        setError("Failed to load event details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    setIsRegistering(true);
    setError("");
    try {
      await registrationsService.register(id);
      setRegisterSuccess(true);
      setEvent((prev) => ({ ...prev, attendees: (prev.attendees || 0) + 1 }));
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err.response?.data?.message || "Failed to register for this event.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="event-details-loading">
        <LoadingSpinner size="lg" text="Loading event details..." />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container" style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <h2>{error || "Event not found"}</h2>
        <Link to="/events" className="btn btn--outline" style={{ marginTop: "1rem" }}>
          Back to Events
        </Link>
      </div>
    );
  }

  const remainingSeats = event.capacity != null ? event.capacity - (event.attendees || 0) : null;
  const isSoldOut = remainingSeats !== null && remainingSeats <= 0;
  const isFree = event.price === 0 || event.price === "Free" || !event.price;

  return (
    <div className="event-details-page">
      <div
        className="event-details__hero"
        style={{
          backgroundImage: event.imageUrl ? `url(${event.imageUrl})` : "none",
          background: !event.imageUrl ? "linear-gradient(135deg, rgba(108, 99, 255, 0.3), rgba(192, 132, 252, 0.3))" : undefined,
        }}
      >
        <div className="event-details__hero-overlay" />
        <div className="container event-details__hero-content">
          <Link to="/events" className="back-link">
            <FiArrowLeft /> Back to Events
          </Link>
          <div className="event-details__tags">
            {event.category_name && (
              <span className="event-details__tag">
                <FiTag /> {event.category_name}
              </span>
            )}
            <span className="event-details__price">
              {isFree ? "Free" : `$${event.price}`}
            </span>
          </div>
          <h1 className="event-details__title">{event.title}</h1>
        </div>
      </div>

      <div className="container event-details__main">
        <div className="event-details__content">
          {error && (
            <div style={{ padding: "1rem", background: "rgba(255, 101, 132, 0.1)", color: "#ff6584", borderRadius: "8px", marginBottom: "1.5rem" }}>
              {error}
            </div>
          )}

          <section className="detail-section">
            <h2>About this event</h2>
            <div className="detail-section__text">
              {event.description ? (
                event.description.split("\n").map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))
              ) : (
                <p style={{ color: "rgba(255,255,255,0.4)" }}>No description provided.</p>
              )}
            </div>
          </section>

          <section className="detail-section">
            <h2>Organizer</h2>
            <div className="organizer-card">
              <div className="organizer-card__avatar">
                <FiUser />
              </div>
              <div className="organizer-card__info">
                <h3>{event.organizer_name || "Event Organizer"}</h3>
                <p>Contact the organizer with any questions</p>
              </div>
            </div>
          </section>
        </div>

        <div className="event-details__sidebar">
          <div className="booking-card">
            <div className="booking-card__header">
              <h3>Date & Time</h3>
            </div>

            <ul className="booking-card__list">
              <li>
                <FiCalendar className="booking-card__icon" />
                <div>
                  <strong>{formatDate(event.date)}</strong>
                  <span>{event.time || "Time TBA"}</span>
                </div>
              </li>
              <li>
                <FiMapPin className="booking-card__icon" />
                <div>
                  <strong>Location</strong>
                  <span>{event.location || "Online"}</span>
                </div>
              </li>
            </ul>

            <div className="booking-card__stats">
              {remainingSeats !== null && (
                <div className="stat">
                  <span className="stat__value">{Math.max(remainingSeats, 0)}</span>
                  <span className="stat__label">Seats left</span>
                </div>
              )}
              <div className="stat">
                <span className="stat__value">{event.attendees || 0}</span>
                <span className="stat__label">Attending</span>
              </div>
              {event.capacity != null && (
                <div className="stat">
                  <span className="stat__value">{event.capacity}</span>
                  <span className="stat__label">Capacity</span>
                </div>
              )}
            </div>

            <div className="booking-card__actions">
              {canRegister && (
                registerSuccess ? (
                  <div className="booking-card__success">
                    ✅ You're registered!
                  </div>
                ) : (
                  <button
                    className="btn btn--primary btn--lg"
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={handleRegister}
                    disabled={isRegistering || isSoldOut}
                  >
                    {isRegistering ? (
                      <>Processing...</>
                    ) : isSoldOut ? (
                      "Sold Out"
                    ) : (
                      "Register Now"
                    )}
                  </button>
                )
              )}

              {!isAuthenticated && (
                <Link to="/login" state={{ from: location }} className="btn btn--primary btn--lg" style={{ width: "100%", justifyContent: "center" }}>
                  Login to Register
                </Link>
              )}

              <button
                className="btn btn--ghost"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={handleShare}
              >
                <FiShare2 /> Share Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
