import { useState, useEffect } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import EventCard from "../../components/events/EventCard";
import Pagination from "../../components/ui/Pagination";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { eventsService, categoriesService } from "../../services";
import "./EventList.css";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 9;

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoriesService.getAll();
        const data = res.data?.data ?? [];
        setCategories(Array.isArray(data) ? data : []);
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch events when filters or page change
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError("");
      try {
        const params = { page: currentPage, limit: LIMIT };
        if (searchTerm)       params.search     = searchTerm;
        if (selectedCategory) params.categoryId = selectedCategory;

        const res  = await eventsService.getAll(params);
        const data = res.data?.data ?? res.data ?? {};
        const items = Array.isArray(data) ? data : (data.events ?? []);

        setEvents(items);
        setTotalPages(data.totalPages ?? Math.ceil(items.length / LIMIT) ?? 1);
      } catch (err) {
        setError("Failed to load events. Please try again later.");
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [currentPage, searchTerm, selectedCategory]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? "" : categoryId);
    setCurrentPage(1);
  };

  return (
    <div className="events-page">
      <div className="container">
        {/* Header */}
        <div className="events-header">
          <h1 className="events-title">Discover Events</h1>
          <p className="events-subtitle">Find and book your next great experience.</p>

          <div className="events-search">
            <FiSearch className="events-search__icon" />
            <input
              type="text"
              className="events-search__input"
              placeholder="Search by event title, location, or keyword..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="events-filters">
          <div className="events-filters__categories">
            <button
              className={`filter-pill ${selectedCategory === "" ? "filter-pill--active" : ""}`}
              onClick={() => handleCategoryClick("")}
            >
              All Events
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`filter-pill ${selectedCategory === cat.id ? "filter-pill--active" : ""}`}
                onClick={() => handleCategoryClick(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <button className="btn btn--ghost filter-btn">
            <FiFilter /> More Filters
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="events-loading">
            <LoadingSpinner size="lg" text="Loading events..." />
          </div>
        ) : error ? (
          <div className="events-empty">
            <p className="events-empty__text">{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="events-empty">
            <div className="events-empty__icon">🔍</div>
            <h3>No events found</h3>
            <p className="events-empty__text">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              className="btn btn--outline"
              onClick={() => { setSearchTerm(""); setSelectedCategory(""); }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="events-grid-container">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default EventList;
