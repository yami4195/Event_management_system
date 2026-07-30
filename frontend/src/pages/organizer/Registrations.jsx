import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Download, Users, CheckCircle, Clock } from "lucide-react";
import { useOrganizer } from "../../hooks/useOrganizer";
import RegistrationTable from "../../components/organizer/RegistrationTable";
import SearchBar from "../../components/organizer/SearchBar";
import EmptyState from "../../components/organizer/EmptyState";
import Pagination from "../../components/organizer/Pagination";
import DashboardCard from "../../components/organizer/DashboardCard";
import { Button } from "../../components/ui/button";

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
  const totalAttendees = registrations.reduce((sum, r) => sum + r.quantity, 0);
  const checkedInCount = registrations.filter((r) => r.checkInStatus === "Checked In").length;
  const pendingCount = registrations.filter((r) => r.status === "Pending").length;

  const handleExportCSV = () => {
    alert("Exporting attendee registrations CSV report...");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Attendee Registrations
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track confirmed tickets, attendee contact details, and check-in statuses.
          </p>
        </div>

        <Button
          onClick={handleExportCSV}
          variant="outline"
          className="font-bold text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <DashboardCard
          title="Total Registrations"
          value={registrations.length}
          trend={`${totalAttendees} total tickets`}
          isPositive={true}
          icon={Users}
          iconBg="bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
        />
        <DashboardCard
          title="Checked-In Attendees"
          value={checkedInCount}
          trend={`${Math.round((checkedInCount / (registrations.length || 1)) * 100)}% check-in rate`}
          isPositive={true}
          icon={CheckCircle}
          iconBg="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
        />
        <DashboardCard
          title="Pending Payments"
          value={pendingCount}
          trend="Action required"
          isPositive={false}
          icon={Clock}
          iconBg="bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
        />
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by attendee name, email, or event..."
        />

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Registrations</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="checked_in">Checked In</option>
          </select>
        </div>
      </div>

      {/* Registration Table */}
      {filteredRegistrations.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No registrations found"
          description="There are no registrations matching your search filters."
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
