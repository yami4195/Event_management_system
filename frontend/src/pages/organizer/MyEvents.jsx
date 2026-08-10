import { useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Calendar } from "lucide-react";
import { useOrganizer } from "../../hooks/useOrganizer";
import FilterBar from "../../components/organizer/FilterBar";
import EventCard from "../../components/organizer/EventCard";
import EventTable from "../../components/organizer/EventTable";
import Pagination from "../../components/organizer/Pagination";
import DeleteModal from "../../components/organizer/DeleteModal";
import EmptyState from "../../components/organizer/EmptyState";
import "../../styles/components/my-events.css";

export default function MyEvents() {
  const {
    loading,
    events,
    paginatedEvents,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    pageSize,
    deleteEvent,
  } = useOrganizer();

  const [viewMode, setViewMode] = useState("grid");
  const [selectedDeleteEvent, setSelectedDeleteEvent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const categories = Array.from(new Set(events.map((e) => e.category).filter(Boolean)));

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setCurrentPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDeleteEvent) return;
    setIsDeleting(true);
    await deleteEvent(selectedDeleteEvent.id);
    setIsDeleting(false);
    setSelectedDeleteEvent(null);
  };

  if (loading) {
    return (
      <div className="my-events-wrapper" style={{ alignItems: "center", justifyCenter: "center", minHeight: "400px" }}>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3" />
        <p style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>Loading Event Portfolio...</p>
      </div>
    );
  }

  return (
    <div className="my-events-wrapper">
      {/* Header Banner Card */}
      <div className="my-events-header-card">
        <div className="header-title-area">
          <div className="header-stats-pill">
            <span>{events.length} {events.length === 1 ? "Event" : "Total Events"} Registered</span>
          </div>
          <h1>My Event Portfolio</h1>
          <p>Manage your published listings, monitor live ticket sales progress, and update details.</p>
        </div>

        <Link to="/organizer/events/create" className="create-event-action-btn">
          <PlusCircle className="w-5 h-5" />
          <span>Create Event</span>
        </Link>
      </div>

      {/* Filter & View Switcher Toolbar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        categories={categories}
        onReset={handleResetFilters}
      />

      {/* Content Section */}
      {paginatedEvents.items.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No events match your criteria"
          description="Try adjusting your search query, status filters, or category selections."
          actionLabel="Clear Filters"
          onAction={handleResetFilters}
        />
      ) : viewMode === "grid" ? (
        <div className="events-cards-grid">
          {paginatedEvents.items.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              onDelete={(e) => setSelectedDeleteEvent(e)}
            />
          ))}
        </div>
      ) : (
        <EventTable
          events={paginatedEvents.items}
          onDelete={(e) => setSelectedDeleteEvent(e)}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={(field, order) => {
            setSortBy(field);
            setSortOrder(order);
          }}
        />
      )}

      {/* Pagination Bar */}
      <Pagination
        currentPage={paginatedEvents.currentPage}
        totalPages={paginatedEvents.totalPages}
        totalItems={paginatedEvents.totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(selectedDeleteEvent)}
        onClose={() => setSelectedDeleteEvent(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Event"
        description={`Are you sure you want to delete "${selectedDeleteEvent?.title}"? All ticket sales and attendee data will be permanently deleted.`}
      />
    </div>
  );
}
