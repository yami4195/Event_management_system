import { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiCalendar } from "react-icons/fi";
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

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 9; // Events per page

  // Fetch Categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fallback mock categories if API fails or is empty
        const mockCategories = [
          { id: 1, name: "Technology", color: "#6c63ff" },
          { id: 2, name: "Music", color: "#ff6584" },
          { id: 3, name: "Business", color: "#43e97b" },
          { id: 4, name: "Arts", color: "#f97316" },
        ];
        
        try {
          const res = await categoriesService.getAll();
          if (res.data?.data && res.data.data.length > 0) {
            setCategories(res.data.data);
          } else {
             setCategories(mockCategories);
          }
        } catch (apiError) {
           console.warn("Failed to fetch categories, using mock data", apiError);
           setCategories(mockCategories);
        }
      } catch (err) {
        console.error("Error setting categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Events when filters or page change
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError("");
      try {
        // Prepare API params
        const params = {
          page: currentPage,
          limit: LIMIT,
        };
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory) params.categoryId = selectedCategory;

        // Try API
        try {
           const res = await eventsService.getAll(params);
           const data = res.data?.data || res.data || [];
           const items = Array.isArray(data) ? data : (data.events || []);
           
           if (items.length > 0) {
              setEvents(items);
              setTotalPages(data.totalPages || Math.ceil(items.length / LIMIT) || 1);
              setIsLoading(false);
              return;
           }
        } catch (apiError) {
           console.warn("API returned error or empty for events, using mock data", apiError);
        }

        // Mock data fallback if API is not ready or returns empty
        setTimeout(() => {
          let mockEvents = Array.from({ length: 24 }).map((_, i) => ({
            id: i + 1,
            title: `Awesome Event ${i + 1}`,
            date: new Date(Date.now() + i * 86400000).toISOString(),
            location: i % 2 === 0 ? "San Francisco, CA" : "Online",
            price: i % 3 === 0 ? "Free" : 49 + i,
            attendees: 100 + i * 5,
            category: categories[(i % categories.length)] || { name: "General" },
            emoji: ["💻", "🎶", "🚀", "🎨"][i % 4]
          }));

          // Apply local filters for mock data
          if (searchTerm) {
            mockEvents = mockEvents.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));
          }
          if (selectedCategory) {
            mockEvents = mockEvents.filter(e => e.category?.id?.toString() === selectedCategory.toString());
          }

          setTotalPages(Math.ceil(mockEvents.length / LIMIT) || 1);
          setEvents(mockEvents.slice((currentPage - 1) * LIMIT, currentPage * LIMIT));
          setIsLoading(false);
        }, 600);

      } catch (err) {
        setError("Failed to load events. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [currentPage, searchTerm, selectedCategory, categories]);

  // Handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? "" : categoryId);
    setCurrentPage(1);
  };

  return (
    <div className="events-page">
      <div className="container">
        {/* Page Header */}
        <div className="events-header">
          <h1 className="events-title">Discover Events</h1>
          <p className="events-subtitle">Find and book your next great experience.</p>
          
          {/* Search Bar */}
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
            {categories.map(cat => (
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
            <p className="events-empty__text">Try adjusting your search or filters to find what you're looking for.</p>
            <button className="btn btn--outline" onClick={() => { setSearchTerm(""); setSelectedCategory(""); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="events-grid">
              {events.map(event => (
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