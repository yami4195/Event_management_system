import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Download, Users, CheckCircle, Clock } from "lucide-react";
import { useOrganizer } from "../../hooks/useOrganizer";
import RegistrationTable from "../../components/organizer/RegistrationTable";
import SearchBar from "../../components/organizer/SearchBar";
import EmptyState from "../../components/organizer/EmptyState";
import Pagination from "../../components/organizer/Pagination";
import "../../styles/components/attendants.css";

export default function Registrations() {
  const [searchParams] = useSearchParams();
  const filterEventId = searchParams.get("eventId");

  const { loading, registrations, toggleCheckIn } = useOrganizer();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filtered registrations list
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const matchesEvent = !filterEventId || reg.eventId === filterEventId;
      const matchesSearch =
        !searchQuery ||
        reg.attendeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.eventTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        reg.status.toLowerCase() === statusFilter.toLowerCase() ||
        reg.checkInStatus.toLowerCase().replace(" ", "_") === statusFilter.toLowerCase();

      return matchesEvent && matchesSearch && matchesStatus;
    });
  }, [registrations, filterEventId, searchQuery, statusFilter]);

  // Paginated registrations
  const totalItems = filteredRegistrations.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedRegistrations = filteredRegistrations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Quick stats
  const totalAttendees = registrations.reduce((sum, r) => sum + (r.quantity || 1), 0);
  const checkedInCount = registrations.filter((r) => r.checkInStatus === "Checked In").length;
  const pendingCount = registrations.filter((r) => r.status === "Pending").length;
  const checkInRate = Math.round((checkedInCount / (registrations.length || 1)) * 100);

  const handleExportCSV = () => {
    alert("Exporting attendee registrations CSV report...");
  };

  if (loading) {
    return (
      <div className="attendants-wrapper" style={{ alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3" />
        <p style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>Loading Customer & Attendant Directory...</p>
      </div>
    );
  }

  return (
    <div className="attendants-wrapper">
      {/* Header Banner Card */}
      <div className="attendants-header-card">
        <div className="attendants-title-area">
          <div className="attendants-count-pill">
            <span>{registrations.length} Total Registered Customers</span>
          </div>
          <h1>Customer & Attendants Management</h1>
          <p>Track confirmed tickets, attendee contact info, payment statuses, and instant door check-ins.</p>
        </div>

        <button type="button" onClick={handleExportCSV} className="btn-export-csv">
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="attendants-stats-grid">
        <div className="attendants-stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Total Registrations</span>
            <div className="stat-card-icon stat-icon-blue">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-card-value">{registrations.length}</span>
            <span className="stat-card-sub">{totalAttendees} total tickets sold</span>
          </div>
        </div>

        <div className="attendants-stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Checked-In Attendees</span>
            <div className="stat-card-icon stat-icon-emerald">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-card-value">{checkedInCount}</span>
            <span className="stat-card-sub">{checkInRate}% check-in rate</span>
          </div>
        </div>

        <div className="attendants-stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Pending Payments</span>
            <div className="stat-card-icon stat-icon-amber">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-card-value">{pendingCount}</span>
            <span className="stat-card-sub" style={{ color: "#d97706" }}>Payment follow-up required</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="attendants-filter-toolbar">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by attendee name, email, or event title..."
        />

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="attendants-select-filter"
          >
            <option value="all">All Registrations</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="checked_in">Checked In</option>
          </select>
        </div>
      </div>

      {/* Attendants Table Section */}
      {filteredRegistrations.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No registrations found"
          description="There are no registered attendants matching your search filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery("");
            setStatusFilter("all");
          }}
        />
      ) : (
        <>
          <RegistrationTable
            registrations={paginatedRegistrations}
            onToggleCheckIn={toggleCheckIn}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
