import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Calendar,
  Sparkles,
  RotateCcw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  User,
  Tag,
} from "lucide-react";
import { eventsService } from "../services";
import { formatDate } from "../utils/helpers";
import "./events/Events.css";

const PAGE_SIZE = 6;

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  //I add this hooks for controlling the search suggesttion animations
  const [text, setText] = useState("");
const [wordIndex, setWordIndex] = useState(0);
const [isDeleting, setIsDeleting] = useState(false);

  const suggestions = useMemo(()=>[
  "Music",
  "Technology",
  "Sports",
  "Movies",
  "Photography",
  "Programming"
],[]);


useEffect(() => {
  const currentWord = suggestions[wordIndex];

  let speed = isDeleting ? 50 : 100;

  const timeout = setTimeout(() => {
    if (!isDeleting) {
      setText(currentWord.substring(0, text.length + 1));

      if (text === currentWord) {
        setTimeout(() => setIsDeleting(true), 1200);
      }
    } else {
      setText(currentWord.substring(0, text.length - 1));

      if (text === "") {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % suggestions.length);
      }
    }
  }, speed);

  return () => clearTimeout(timeout);
}, [text, isDeleting, wordIndex,suggestions]);

  const fetchEventsData = async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const res = await eventsService.getAll();
      const payload = res.data?.data?.events || res.data?.events || res.data?.data || res.data || [];
      if (Array.isArray(payload)) {
        setEvents(payload);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setLoadError("Failed to fetch events from the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsData();
  }, []);

  // Filter & Sort Logic
  const filteredEvents = useMemo(() => {
    return events
      .filter((evt) => {
        // Keyword Search
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const hay = [evt.title, evt.description, evt.location, evt.organizer || evt.organizer_name]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          if (!hay.includes(term)) return false;
        }

        // Category Filter
        if (category !== "all") {
          const cat = (evt.category || evt.category_name || "").toLowerCase();
          if (cat !== category.toLowerCase()) return false;
        }

        // Location Filter
        if (location.trim()) {
          const loc = (evt.location || "").toLowerCase();
          if (!loc.includes(location.toLowerCase().trim())) return false;
        }

        // Date Filter
        if (date) {
          const evtDate = evt.date ? new Date(evt.date).toISOString().split("T")[0] : "";
          if (evtDate !== date) return false;
        }

        // Status Filter
        if (status !== "all") {
          const evtStatus = (evt.status || "Upcoming").toLowerCase();
          if (evtStatus !== status.toLowerCase()) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_low") {
          const priceA = typeof a.price === "number" ? a.price : 0;
          const priceB = typeof b.price === "number" ? b.price : 0;
          return priceA - priceB;
        }
        if (sortBy === "popular") {
          return (b.attendees || 0) - (a.attendees || 0);
        }
        if (sortBy === "date_asc") {
          return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
        }
        // newest (default)
        return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
      });
  }, [events, searchTerm, category, location, date, status, sortBy]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, category, location, date, status, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredEvents.length / PAGE_SIZE) || 1;
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredEvents.slice(start, start + PAGE_SIZE);
  }, [filteredEvents, currentPage]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setCategory("all");
    setLocation("");
    setDate("");
    setStatus("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  return (
    <div className="events-page">
      {/* 1. HERO BANNER */}
      <section className="events-hero">
        <div className="events-hero-content">
          <div className="events-hero-badge">
            <Sparkles size={16} /> Global Event Directory
          </div>
          <h1 className="events-hero-title">Discover Amazing Events</h1>
          <p className="events-hero-subtitle">
            Explore upcoming conferences, concerts, workshops, and gatherings happening worldwide.
          </p>
        </div>
      </section>

      {/* 2. FLOATING SEARCH & FILTER PANEL */}
      <div className="events-filter-wrapper">
        <div className="events-filter-card">
          <div className="events-filter-grid">
            {/* Search Input */}
            <div className="filter-group span-search">
              <label className="filter-label">Event Name</label>
              <div className="filter-input-wrap">
                <Search className="filter-icon" />
                <input
                  type="text"
                  placeholder={text}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>

            {/* Category Select */}
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <div className="filter-input-wrap">
                <Tag className="filter-icon" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Categories</option>
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Music">Music & Entertainment</option>
                  <option value="Design">Design & UX</option>
                  <option value="Health">Health & Wellness</option>
                  <option value="Sports">Sports & Fitness</option>
                </select>
              </div>
            </div>

            {/* Location Input */}
            <div className="filter-group">
              <label className="filter-label">Location</label>
              <div className="filter-input-wrap">
                <MapPin className="filter-icon" />
                <input
                  type="text"
                  placeholder="City or venue..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>

            {/* Date Picker */}
            <div className="filter-group">
              <label className="filter-label">Date</label>
              <div className="filter-input-wrap">
                <Calendar className="filter-icon" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="filter-select"
                style={{ paddingLeft: "14px" }}
              >
                <option value="all">All Statuses</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
                style={{ paddingLeft: "14px" }}
              >
                <option value="newest">Newest First</option>
                <option value="date_asc">Date: Ascending</option>
                <option value="price_low">Price: Low to High</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="filter-group">
              <button onClick={handleResetFilters} type="button" className="btn-reset-filter">
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN RESULTS CONTAINER */}
      <main className="events-main-container">
        <div className="events-results-header">
          <h2 className="results-title">Available Events</h2>
          <span className="results-count-badge">
            {filteredEvents.length} {filteredEvents.length === 1 ? "Event" : "Events"} Found
          </span>
        </div>

        {/* LOADING SKELETON STATE */}
        {isLoading ? (
          <div className="events-grid">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="skeleton-card">
                <div className="skeleton-img" />
                <div className="skeleton-body">
                  <div className="skeleton-line w-80" />
                  <div className="skeleton-line w-60" />
                  <div className="skeleton-line w-40" />
                </div>
              </div>
            ))}
          </div>
        ) : loadError ? (
          /* ERROR STATE */
          <div className="state-box">
            <div className="state-icon-wrap">
              <AlertCircle size={32} />
            </div>
            <h3 className="state-title">Failed to Load Events</h3>
            <p className="state-desc">{loadError}</p>
            <button onClick={fetchEventsData} className="btn-primary-action">
              Retry Connection
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          /* EMPTY STATE */
          <div className="state-box">
            <div className="state-icon-wrap">
              <Search size={32} />
            </div>
            <h3 className="state-title">No events found</h3>
            <p className="state-desc">
              We couldn't find any events matching your search criteria. Try adjusting or resetting your filters.
            </p>
            <button onClick={handleResetFilters} className="btn-primary-action">
              Clear All Filters
            </button>
          </div>
        ) : (
          /* EVENTS GRID */
          <div className="events-grid">
            {paginatedEvents.map((evt) => {
              const eventId = evt.event_id || evt.id;
              const displayImage =
                evt.image ||
                evt.imageUrl ||
                evt.image_url ||
                evt.cover_image ||
                evt.media_url ||
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80";

              const isFree = evt.price === 0 || evt.price === "Free" || !evt.price;
              const formattedPrice = isFree
                ? "Free"
                : typeof evt.price === "number"
                ? `$${evt.price.toFixed(2)}`
                : evt.price;

              const totalSeats = evt.capacity || evt.total_seats || 100;
              const attendeesCount = evt.attendees || evt.registered_count || 0;
              const remainingSeats =
                evt.seatsLeft !== undefined
                  ? evt.seatsLeft
                  : Math.max(totalSeats - attendeesCount, 0);

              const evtStatus = (evt.status || "Upcoming").toLowerCase();
              const isSoldOut = remainingSeats <= 0 || evtStatus === "sold out";

              return (
                <article key={eventId} className="event-card">
                  <div className="event-card-media">
                    <img
                      src={displayImage}
                      alt={evt.title || "Event cover"}
                      className="event-card-img"
                      loading="lazy"
                    />
                    {evt.category && (
                      <span className="badge-category">{evt.category || evt.category_name}</span>
                    )}
                    <span
                      className={`badge-status ${
                        isSoldOut ? "soldout" : evtStatus
                      }`}
                    >
                      {isSoldOut ? "Sold Out" : evt.status || "Upcoming"}
                    </span>
                    <span className="badge-price">{formattedPrice}</span>
                  </div>

                  <div className="event-card-body">
                    <h3 className="event-card-title">{evt.title}</h3>
                    <p className="event-card-desc">
                      {evt.description ||
                        "Join us for an unforgettable event filled with learning, networking, and inspiration."}
                    </p>

                    <div className="event-card-meta">
                      <div className="meta-row">
                        <Calendar className="meta-icon" />
                        <span>
                          {formatDate(evt.date)} {evt.time ? `· ${evt.time}` : ""}
                        </span>
                      </div>
                      <div className="meta-row">
                        <MapPin className="meta-icon" />
                        <span>{evt.location || "Online / Virtual Venue"}</span>
                      </div>
                      <div className="meta-row">
                        <User className="meta-icon" />
                        <span>{evt.organizer || evt.organizer_name || "Event Host"}</span>
                      </div>
                    </div>

                    <div className="event-card-footer">
                      <span className="seats-info">
                        {isSoldOut ? "0 Left" : `${remainingSeats} / ${totalSeats} Seats Left`}
                      </span>
                      <Link to={`/events/${eventId}`} className="btn-card-details">
                        View Details <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* 4. PAGINATION */}
        {!isLoading && !loadError && totalPages > 1 && (
          <div className="pagination-wrap">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn-page"
              aria-label="Previous Page"
            >
              <ChevronLeft size={16} /> Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`btn-page ${currentPage === page ? "active" : ""}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn-page"
              aria-label="Next Page"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
