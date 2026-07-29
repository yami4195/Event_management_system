import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Tag,
  Ticket,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Share2,
  Info,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { eventsService } from "../../services";
import { registrationsService } from "../../services/registrations.service";
import { formatDate } from "../../utils/helpers";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { ORGANIZER_ROLES } from "../../constants/roles";
import "./EventDetails.css";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const canRegister = isAuthenticated && !ORGANIZER_ROLES.includes(user?.role);

  const [event, setEvent] = useState(null);
  const [similarEvents, setSimilarEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    const fetchEventAndSimilar = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await eventsService.getById(id);
        const data = res.data?.data?.event || res.data?.data || res.data;
        if (data) {
          setEvent(data);

          // Fetch similar events
          try {
            const allRes = await eventsService.getAll();
            const allEvts =
              allRes.data?.data?.events ||
              allRes.data?.events ||
              allRes.data?.data ||
              allRes.data ||
              [];
            if (Array.isArray(allEvts)) {
              const currentId = data.event_id || data.id;
              const filtered = allEvts.filter(
                (item) => (item.event_id || item.id) !== currentId
              );
              setSimilarEvents(filtered.slice(0, 3));
            }
          } catch (e) {
            console.error("Failed to load similar events", e);
          }
        } else {
          setError("Event not found.");
        }
      } catch (err) {
        console.error("Failed to fetch event details:", err);
        setError("Failed to load event details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEventAndSimilar();
    } else {
      setIsLoading(false);
      setError("Invalid event ID.");
    }
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
      setEvent((prev) => ({
        ...prev,
        attendees: (prev.attendees || 0) + 1,
        user_registered: true,
      }));
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
          title: event?.title || "Event Details",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 3000);
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="event-detail-page">
        <div className="detail-loading-wrap">
          <LoadingSpinner size="lg" text="Loading event details..." />
        </div>
      </div>
    );
  }

  // ERROR & EMPTY STATE
  if (!event || error) {
    return (
      <div className="event-detail-page">
        <div className="detail-state-card">
          <div className="state-icon-circle">
            <AlertTriangle size={28} />
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "8px" }}>
            {error || "Event Not Found"}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "24px" }}>
            We couldn't find the event you were looking for. It may have been removed or the URL is invalid.
          </p>
          <Link to="/events" className="btn-register-primary">
            <ArrowLeft size={16} /> Back to Events
          </Link>
        </div>
      </div>
    );
  }

  // Derived Properties
  const displayCoverImage =
    event.image ||
    event.imageUrl ||
    event.image_url ||
    event.cover_image ||
    event.media_url ||
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80";

  const isFree = event.price === 0 || event.price === "Free" || !event.price;
  const formattedPrice = isFree
    ? "Free"
    : typeof event.price === "number"
    ? `$${event.price.toFixed(2)}`
    : event.price;

  const totalCapacity = event.capacity || event.total_seats || 100;
  const attendeesCount = event.attendees || event.registered_count || 0;
  const remainingSeats =
    event.seatsLeft !== undefined
      ? event.seatsLeft
      : Math.max(totalCapacity - attendeesCount, 0);

  const isSoldOut = remainingSeats <= 0 || event.status === "Sold Out";
  const isCancelled = event.status === "Cancelled";
  const isCompleted = event.status === "Completed";
  const userAlreadyRegistered =
    event.user_registered || event.is_registered || registerSuccess;

  const categoryName = event.category || event.category_name || "General Event";
  const organizerName = event.organizer || event.organizer_name || "Event Organizer";
  const galleryImages = event.images || event.gallery || [];
  const bookedPercentage = Math.min(
    Math.round(((totalCapacity - remainingSeats) / totalCapacity) * 100),
    100
  );

  return (
    <div className="event-detail-page">
      {/* 1. BACK NAVIGATION */}
      <div className="back-nav-container">
        <Link to="/events" className="btn-back">
          <ArrowLeft size={16} /> Back to Events
        </Link>
      </div>

      {/* 2. HERO SECTION */}
      <section className="event-detail-hero">
        <div className="hero-media-wrap">
          <img src={displayCoverImage} alt={event.title} className="hero-cover-img" />
          <div className="hero-overlay" />

          {/* Top Badges */}
          <div className="hero-top-badges">
            <span className="hero-badge category">
              <Tag size={12} /> {categoryName}
            </span>

            {isCancelled ? (
              <span className="hero-badge cancelled">
                <XCircle size={12} /> Cancelled
              </span>
            ) : isSoldOut ? (
              <span className="hero-badge soldout">
                <AlertTriangle size={12} /> Sold Out
              </span>
            ) : isCompleted ? (
              <span className="hero-badge completed">Completed</span>
            ) : (
              <span className="hero-badge upcoming">
                <CheckCircle2 size={12} /> Upcoming
              </span>
            )}
          </div>

          {/* Price Tag */}
          <div className="hero-price-tag">{formattedPrice}</div>

          {/* Hero Content */}
          <div className="hero-body-content">
            <h1 className="hero-event-title">{event.title}</h1>
            <div className="hero-meta-row">
              <div className="hero-meta-item">
                <Calendar className="hero-meta-icon" />
                <span>
                  {formatDate(event.date)} {event.time && `· ${event.time}`}
                </span>
              </div>
              <div className="hero-meta-item">
                <MapPin className="hero-meta-icon" />
                <span>{event.location || "Online / Virtual Venue"}</span>
              </div>
              <div className="hero-meta-item">
                <User className="hero-meta-icon" />
                <span>Hosted by {organizerName}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TWO-COLUMN MAIN CONTENT LAYOUT */}
      <main className="detail-main-layout">
        {/* LEFT COLUMN: DESCRIPTION, ORGANIZER, GALLERY */}
        <div className="left-content-column">
          {/* Event Description Card */}
          <article className="detail-card">
            <h2 className="card-heading">
              <Info className="card-heading-icon" /> About This Event
            </h2>
            <div className="description-text">
              {event.description ? (
                event.description
              ) : (
                <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
                  No detailed description provided for this event.
                </p>
              )}
            </div>
          </article>

          {/* Organizer Card */}
          <article className="detail-card">
            <h2 className="card-heading">Organizer Information</h2>
            <div className="organizer-profile">
              <div className="organizer-avatar">
                {organizerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="organizer-name">{organizerName}</div>
                <div className="organizer-role">Official Event Host</div>
              </div>
            </div>
          </article>

          {/* Event Gallery */}
          {galleryImages.length > 0 && (
            <article className="detail-card">
              <h2 className="card-heading">Event Gallery</h2>
              <div className="gallery-grid">
                {galleryImages.map((imgUrl, i) => (
                  <div key={i} className="gallery-item">
                    <img src={imgUrl} alt={`Gallery preview ${i}`} className="gallery-img" />
                  </div>
                ))}
              </div>
            </article>
          )}
        </div>

        {/* RIGHT COLUMN: STICKY SIDEBAR WIDGET */}
        <aside className="right-sidebar-column">
          <div className="sidebar-info-card">
            {/* Price Header */}
            <div className="info-price-block">
              <div>
                <span className="item-label">Ticket Price</span>
                <span className="price-amount">{formattedPrice}</span>
              </div>
              <span className="price-type-pill">{isFree ? "Free Admission" : "Paid Event"}</span>
            </div>

            {/* Info List */}
            <div className="sidebar-list">
              <div className="sidebar-list-item">
                <div className="item-icon-wrap">
                  <Calendar size={18} />
                </div>
                <div>
                  <span className="item-label">Date & Time</span>
                  <span className="item-val">{formatDate(event.date)}</span>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {event.time || "Time TBA"}
                  </span>
                </div>
              </div>

              <div className="sidebar-list-item">
                <div className="item-icon-wrap">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="item-label">Venue / Location</span>
                  <span className="item-val">{event.location || "Location TBA"}</span>
                </div>
              </div>

              <div className="sidebar-list-item">
                <div className="item-icon-wrap">
                  <Clock size={18} />
                </div>
                <div>
                  <span className="item-label">Registration Deadline</span>
                  <span className="item-val">
                    {event.registration_deadline
                      ? formatDate(event.registration_deadline)
                      : "Open until event starts"}
                  </span>
                </div>
              </div>
            </div>

            {/* Capacity Progress Bar & Stats */}
            <div className="stats-block">
              <div className="stats-row">
                <span>Seat Availability</span>
                <span>
                  {isSoldOut ? "Sold Out" : `${remainingSeats} / ${totalCapacity} Left`}
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${bookedPercentage}%` }} />
              </div>

              <div className="stats-counter-grid">
                <div className="stat-chip">
                  <span className="stat-chip-val">{attendeesCount}</span>
                  <span className="stat-chip-lbl">Registered</span>
                </div>
                <div className="stat-chip">
                  <span className="stat-chip-val">{totalCapacity}</span>
                  <span className="stat-chip-lbl">Capacity</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {userAlreadyRegistered ? (
              <div className="status-alert-success">
                <CheckCircle2 size={18} /> You're registered for this event!
              </div>
            ) : canRegister ? (
              <button
                onClick={handleRegister}
                disabled={isRegistering || isSoldOut || isCancelled}
                className="btn-register-primary"
              >
                {isRegistering ? "Registering..." : isSoldOut ? "Sold Out" : "Register Now"}
              </button>
            ) : !isAuthenticated ? (
              <Link to="/login" state={{ from: location }} className="btn-register-primary">
                Login to Register
              </Link>
            ) : (
              <div style={{ textAlign: "center", fontSize: "12px", color: "var(--text-muted)" }}>
                Organizers cannot register for events.
              </div>
            )}

            <button onClick={handleShare} type="button" className="btn-share-secondary">
              <Share2 size={16} />
              {shareCopied ? "Link Copied!" : "Share Event"}
            </button>
          </div>
        </aside>
      </main>

      {/* 4. SIMILAR EVENTS SECTION */}
      {similarEvents.length > 0 && (
        <section className="similar-events-section">
          <h2 className="similar-title">Similar Events You Might Like</h2>
          <div className="similar-grid">
            {similarEvents.map((sim) => {
              const simId = sim.event_id || sim.id;
              const simImg =
                sim.image ||
                sim.imageUrl ||
                sim.image_url ||
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80";

              return (
                <div key={simId} className="similar-card">
                  <img src={simImg} alt={sim.title} className="similar-card-img" />
                  <div className="similar-card-body">
                    <h3 className="similar-card-title">{sim.title}</h3>
                    <div className="similar-card-meta">
                      <Calendar size={14} /> {formatDate(sim.date)}
                    </div>
                    <div className="similar-card-meta">
                      <MapPin size={14} /> {sim.location || "Venue TBA"}
                    </div>
                    <Link to={`/events/${simId}`} className="btn-similar-details">
                      View Details <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}