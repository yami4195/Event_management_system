import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  RotateCcw,
  Eye,
  CheckCircle2,
  XCircle,
  Trash2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CalendarX,
  UserCheck,
} from "lucide-react";
import { eventsService } from "@/services/events.service";
import { categoriesService } from "@/services/category.service";
import EventStats from "@/components/admin/EventStats";
import StatusBadge from "@/components/common/StatusBadge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const ITEMS_PER_PAGE = 8;

export default function Events() {
  const navigate = useNavigate();
  const [eventList, setEventList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [actionNotice, setActionNotice] = useState(null);
  const [searchIconVisible, setSearchIconVisible] = useState(true);

  // Modal State for Create Event
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newEventData, setNewEventData] = useState({
    title: "",
    category_id: "",
    location: "",
    date: "",
    time: "10:00 AM",
    capacity: 100,
    price: 0,
    description: "",
  });

  const fetchEventsAndCategories = useCallback(async () => {
    setLoading(true);
    try {
      const [eventsRes, catsRes] = await Promise.all([
        eventsService.getAll(),
        categoriesService.getAll().catch(() => ({ data: { data: { categories: [] } } })),
      ]);

      const rawEvents = eventsRes.data?.data?.events || eventsRes.data?.events || [];
      const rawCats = catsRes.data?.data?.categories || catsRes.data?.categories || [];

      setCategories(rawCats);

      const mapped = rawEvents.map((e) => {
        const status = e.status ? e.status.charAt(0).toUpperCase() + e.status.slice(1).toLowerCase() : "Upcoming";
        return {
          id: e.event_id || e.id,
          title: e.title || "Untitled Event",
          organizer: e.organizer_name || "Organizer",
          category: e.category_name || "General",
          category_id: e.category_id,
          location: e.location || "Venue TBD",
          date: e.date ? new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBD",
          rawDate: e.date,
          time: e.time || "10:00 AM",
          capacity: Number(e.capacity) || 0,
          attendees: Number(e.attendees) || 0,
          price: Number(e.price) || 0,
          status: status,
          banner: e.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
          description: e.description || "",
        };
      });

      setEventList(mapped);
    } catch (err) {
      console.error("Failed to load events/categories:", err);
      showToast("Failed to fetch events from the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventsAndCategories();
  }, [fetchEventsAndCategories]);

  const showToast = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return eventList.filter((event) => {
      const matchesSearch =
        searchQuery === "" ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        event.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesCategory =
        categoryFilter === "All" ||
        event.category.toLowerCase() === categoryFilter.toLowerCase();

      const matchesDate =
        dateFilter === "" ||
        (event.rawDate && event.rawDate.includes(dateFilter));

      return matchesSearch && matchesStatus && matchesCategory && matchesDate;
    });
  }, [eventList, searchQuery, statusFilter, categoryFilter, dateFilter]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / ITEMS_PER_PAGE));
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEvents.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEvents, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setDateFilter("");
    setCurrentPage(1);
  };

  // Status Action Handlers
  const handleApproveEvent = async (eventId) => {
    try {
      await eventsService.update(eventId, { status: "upcoming" });
      setEventList((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, status: "Upcoming" } : e))
      );
      showToast("Event approved and published as Upcoming!");
    } catch (err) {
      console.error("Approve error:", err);
      showToast("Failed to update event status.");
    }
  };

  const handleRejectEvent = async (eventId) => {
    try {
      await eventsService.update(eventId, { status: "cancelled" });
      setEventList((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, status: "Cancelled" } : e))
      );
      showToast("Event status marked as Cancelled.");
    } catch (err) {
      console.error("Cancel error:", err);
      showToast("Failed to update event status.");
    }
  };

  const handleDeleteEvent = async (eventId, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete event "${title}"?`)) {
      return;
    }
    try {
      await eventsService.delete(eventId);
      setEventList((prev) => prev.filter((e) => e.id !== eventId));
      showToast(`Event "${title}" deleted successfully.`);
    } catch (err) {
      console.error("Delete event error:", err);
      showToast(err.response?.data?.message || "Failed to delete event.");
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newEventData.title.trim() || !newEventData.category_id || !newEventData.date || !newEventData.location.trim()) {
      showToast("Please fill in all required fields.");
      return;
    }

    setIsCreating(true);
    try {
      const formData = new FormData();
      formData.append("title", newEventData.title.trim());
      formData.append("category_id", newEventData.category_id);
      formData.append("location", newEventData.location.trim());
      formData.append("date", newEventData.date);
      formData.append("time", newEventData.time.trim());
      formData.append("capacity", newEventData.capacity);
      formData.append("price", newEventData.price);
      formData.append("status", "upcoming");
      formData.append("description", newEventData.description.trim());

      await eventsService.create(formData);
      showToast("New event created successfully!");
      setIsCreateModalOpen(false);
      fetchEventsAndCategories();
    } catch (err) {
      console.error("Create event error:", err);
      showToast(err.response?.data?.message || "Failed to create event.");
    } finally {
      setIsCreating(false);
    }
  };

  const isFilterActive =
    searchQuery !== "" ||
    statusFilter !== "All" ||
    categoryFilter !== "All" ||
    dateFilter !== "";

  return (
    <div className="min-h-screen space-y-8 bg-slate-50 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Events Management
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Review, approve, filter, and moderate platform events across all organizers.
          </p>
        </div>

        <Button
          onClick={() => {
            setNewEventData({
              title: "",
              category_id: categories[0]?.category_id || categories[0]?.id || "",
              location: "",
              date: "",
              time: "10:00 AM",
              capacity: 100,
              price: 0,
              description: "",
            });
            setIsCreateModalOpen(true);
          }}
          className="shrink-0 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Create Event
        </Button>
      </div>

      {/* Action Notification Toast/Notice */}
      {actionNotice && (
        <div className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-md transition-all">
          {actionNotice}
        </div>
      )}

      {/* Statistics Cards */}
      <EventStats eventList={eventList} />

      {/* Main Content Card: Search, Filters, Table & Pagination */}
      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader className="border-b border-slate-100 pb-5">
          <CardTitle className="text-lg font-bold text-slate-900">
            All Platform Events ({filteredEvents.length})
          </CardTitle>

          {/* Search & Filters Toolbar */}
          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              {searchIconVisible && (
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              )}
              <Input
                type="text"
                placeholder={searchIconVisible ? "      Search by title, organizer, or location..." : "Search by title, organizer, or location..."}
                value={searchQuery}
                onChange={(e) => {
                  setSearchIconVisible(e.target.value === "");
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 border-slate-200 bg-white"
              />
            </div>

            {/* Filter Selects & Date */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter */}
              <div className="w-[140px]">
                <Select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-10 border-slate-200"
                >
                  <option value="All">All Statuses</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="w-[150px]">
                <Select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-10 border-slate-200"
                >
                  <option value="All">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id || cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Date Input */}
              <div className="w-[150px]">
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-10 border-slate-200 bg-white text-xs"
                />
              </div>

              {isFilterActive && (
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  className="h-10 gap-1.5 border-slate-200 text-slate-600 hover:text-slate-900"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3" />
              <p className="text-sm font-medium text-slate-500">Loading platform events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                <CalendarX className="h-8 w-8 stroke-[1.75]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                No events found.
              </h3>
              <p className="mt-1 text-sm text-slate-500 max-w-sm">
                No events matched your current search filters or date criteria.
              </p>
              {isFilterActive && (
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  className="mt-5 gap-2 border-slate-200 font-semibold"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            /* Events Table */
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/70 hover:bg-slate-50/70 border-b border-slate-200/80">
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Event Title
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Organizer
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Category
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Date & Time
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Location
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </TableHead>
                    <TableHead className="text-right px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEvents.map((event) => (
                    <TableRow
                      key={event.id}
                      className="hover:bg-slate-50/60 transition-colors border-b border-slate-100"
                    >
                      {/* Title & Banner */}
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={event.banner}
                            alt={event.title}
                            className="h-10 w-12 rounded object-cover shrink-0 border border-slate-200"
                          />
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight">
                              {event.title}
                            </p>
                            <span className="text-xs text-slate-400">
                              {event.attendees}/{event.capacity} registered
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Organizer */}
                      <TableCell className="px-4 py-3 text-slate-700 whitespace-nowrap font-medium text-sm">
                        {event.organizer}
                      </TableCell>

                      {/* Category */}
                      <TableCell className="px-4 py-3 whitespace-nowrap">
                        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                          {event.category}
                        </Badge>
                      </TableCell>

                      {/* Date & Time */}
                      <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">{event.date}</span>
                          <span className="text-xs text-slate-400">{event.time}</span>
                        </div>
                      </TableCell>

                      {/* Location */}
                      <TableCell className="px-4 py-3 text-slate-600 whitespace-nowrap text-sm">
                        {event.location}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={event.status} />
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Details */}
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View Event Details"
                            onClick={() => navigate(`/admin/events/${event.id}`)}
                            className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {/* Approve/Publish Button */}
                          {event.status !== "Upcoming" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Publish/Approve Event"
                              onClick={() => handleApproveEvent(event.id)}
                              className="h-8 w-8 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}

                          {/* Cancel/Reject Button */}
                          {event.status !== "Cancelled" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Cancel Event"
                              onClick={() => handleRejectEvent(event.id)}
                              className="h-8 w-8 text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}

                          {/* Delete Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete Event"
                            onClick={() => handleDeleteEvent(event.id, event.title)}
                            className="h-8 w-8 text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredEvents.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 px-6 py-4">
              <span className="text-xs font-medium text-slate-500">
                Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredEvents.length)} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredEvents.length)} of{" "}
                {filteredEvents.length} events
              </span>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="h-8 px-3 text-xs gap-1 border-slate-200 font-medium"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-8 w-8 text-xs font-semibold ${
                        pageNum === currentPage
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  )
                )}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="h-8 px-3 text-xs gap-1 border-slate-200 font-medium"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900">
                Create New Event
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Event Title *
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Annual Tech Symposium 2026"
                  value={newEventData.title}
                  onChange={(e) =>
                    setNewEventData({ ...newEventData, title: e.target.value })
                  }
                  required
                  className="h-10 border-slate-200"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Category *
                  </label>
                  <Select
                    value={newEventData.category_id}
                    onChange={(e) =>
                      setNewEventData({ ...newEventData, category_id: e.target.value })
                    }
                    className="h-10 border-slate-200"
                    required
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map((c) => (
                      <option key={c.category_id || c.id} value={c.category_id || c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Location / Venue *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Millennium Hall, Addis Ababa"
                    value={newEventData.location}
                    onChange={(e) =>
                      setNewEventData({ ...newEventData, location: e.target.value })
                    }
                    required
                    className="h-10 border-slate-200"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Event Date *
                  </label>
                  <Input
                    type="date"
                    value={newEventData.date}
                    onChange={(e) =>
                      setNewEventData({ ...newEventData, date: e.target.value })
                    }
                    required
                    className="h-10 border-slate-200 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Time
                  </label>
                  <Input
                    type="text"
                    placeholder="10:00 AM"
                    value={newEventData.time}
                    onChange={(e) =>
                      setNewEventData({ ...newEventData, time: e.target.value })
                    }
                    className="h-10 border-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Max Capacity
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={newEventData.capacity}
                    onChange={(e) =>
                      setNewEventData({ ...newEventData, capacity: e.target.value })
                    }
                    className="h-10 border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Event overview, agenda, and requirements..."
                  value={newEventData.description}
                  onChange={(e) =>
                    setNewEventData({ ...newEventData, description: e.target.value })
                  }
                  className="w-full rounded-md border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <DialogFooter className="pt-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  {isCreating ? "Publishing..." : "Publish Event"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}