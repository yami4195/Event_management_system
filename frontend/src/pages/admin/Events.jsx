import { useState, useMemo, useEffect } from "react";
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
import { events as initialEvents, updateEvent, deleteEvent, createEvent } from "@/data/events";
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

const ITEMS_PER_PAGE = 5;

export default function Events() {
  const navigate = useNavigate();
  const [eventList, setEventList] = useState(initialEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [actionNotice, setActionNotice] = useState(null);
  const [searchIconVisible,setSearchIconVisible] = useState(true);
  const [calendarIconVisible,setCalendarIconVisible] = useState(true);

  // Modal State for Create Event
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newEventData, setNewEventData] = useState({
    title: "",
    organizer: "",
    category: "Technology",
    location: "",
    venue: "",
    date: "",
    time: "09:00 AM - 05:00 PM",
    capacity: 200,
    banner: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
    description: "",
  });

  // Sync events array whenever component mounts
  useEffect(() => {
    setEventList([...initialEvents]);
  }, []);

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
        event.date.toLowerCase().includes(dateFilter.toLowerCase());

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

  const handleStatusChange = (eventId, newStatus) => {
    updateEvent(eventId, { status: newStatus });
    setEventList([...initialEvents]);
    setActionNotice(`Event status updated to "${newStatus}"`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleDeleteEvent = (eventId) => {
    deleteEvent(eventId);
    setEventList([...initialEvents]);
    setActionNotice("Event deleted successfully");
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    createEvent(newEventData);
    setEventList([...initialEvents]);
    setIsCreateModalOpen(false);
    setActionNotice("New event created successfully!");
    setTimeout(() => setActionNotice(null), 3000);
    setNewEventData({
      title: "",
      organizer: "",
      category: "Technology",
      location: "",
      venue: "",
      date: "",
      time: "09:00 AM - 05:00 PM",
      capacity: 200,
      banner: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
      description: "",
    });
  };

  const isFilterActive =
    searchQuery !== "" ||
    statusFilter !== "All" ||
    categoryFilter !== "All" ||
    dateFilter !== "";

  return (
    <div className="min-h-screen space-y-8 bg-slate-50 p-6 lg:p-8 text-slate-900">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Events Management
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Review, moderate, and manage all events across the platform.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="shrink-0 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Create Event
        </Button>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-emerald-400" />
          {actionNotice}
        </div>
      )}

      {/* Statistics Section */}
      <EventStats eventList={eventList} />

      {/* Main Content Card: Toolbar & Table */}
      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader className="border-b border-slate-100 pb-5">
          <CardTitle className="text-lg font-bold text-slate-900">
            All Events Directory
          </CardTitle>

          {/* Search & Filters Toolbar */}
          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
                {searchIconVisible &&(
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />)}
              <Input
                type="text"
                placeholder="       Search events by title, organizer, location..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchIconVisible(e.target.value === "" );
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 h-10 border-slate-200 bg-white"
              />
            </div>

            {/* Filters Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Select */}
              <div className="w-[140px]">
                <Select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-10 border-slate-200 bg-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                  <option value="Published">Published</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </Select>
              </div>

              {/* Category Select */}
              <div className="w-[140px]">
                <Select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-10 border-slate-200 bg-white"
                >
                  <option value="All">All Categories</option>
                  <option value="Technology">Technology</option>
                  <option value="Design">Design</option>
                  <option value="Music">Music</option>
                  <option value="Business">Business</option>
                  <option value="Health">Health</option>
                </Select>
              </div>

              {/* Date Filter Input */}
              <div className="relative w-[150px]">
                {calendarIconVisible && (
                <Calendar className="absolute left-1 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />)}
                <Input
                  type="text"
                  placeholder="     Date filter..."
                  value={dateFilter}
                  onChange={(e) => {
                    setCalendarIconVisible(e.target.value ==="");
                    setDateFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 h-10 border-slate-200 bg-white text-xs"
                />
              </div>

              {/* Reset Button */}
              {isFilterActive && (
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  className="h-10 gap-1.5 border-slate-200 text-slate-600 hover:text-slate-900 bg-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredEvents.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                <CalendarX className="h-8 w-8 stroke-[1.75]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                No events found.
              </h3>
              <p className="mt-1 text-sm text-slate-500 max-w-sm">
                No platform events matched your search query or active filter criteria.
              </p>
              {isFilterActive && (
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  className="mt-5 gap-2 border-slate-200 font-semibold bg-white"
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
                    <TableHead className="w-[80px] px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Banner
                    </TableHead>
                    <TableHead className="w-[80px] px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Title
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Organizer
                    </TableHead>
                    <TableHead className="w-[800px] px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Category
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Date
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Location
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Capacity
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Registered
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
                  {paginatedEvents.map((evt) => (
                    <TableRow
                      key={evt.id}
                      className="hover:bg-slate-50/60 transition-colors border-b border-slate-100"
                    >
                      {/* Banner Thumbnail */}
                      <TableCell className="px-4 py-3">
                        <div className="h-10 w-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          <img
                            src={evt.banner}
                            alt={evt.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>

                      {/* Title */}
                      <TableCell className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap max-w-[200px] truncate">
                        {evt.title}
                      </TableCell>

                      {/* Organizer */}
                      <TableCell className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {evt.organizer}
                      </TableCell>

                      {/* Category */}
                      <TableCell className="px-4 py-3 whitespace-nowrap">
                        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 font-medium">
                          {evt.category}
                        </Badge>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="px-4 py-3 text-slate-500 text-sm whitespace-nowrap">
                        {evt.date}
                      </TableCell>

                      {/* Location */}
                      <TableCell className="px-4 py-3 text-slate-600 text-sm whitespace-nowrap">
                        {evt.location}
                      </TableCell>

                      {/* Capacity */}
                      <TableCell className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">
                        {evt.capacity}
                      </TableCell>

                      {/* Registered */}
                      <TableCell className="px-4 py-3 font-medium text-indigo-600 whitespace-nowrap">
                        {evt.registered}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={evt.status} />
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Details Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View Event Details"
                            onClick={() => navigate(`/admin/events/${evt.id}`)}
                            className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {/* Approve Button */}
                          {evt.status !== "Published" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Approve & Publish Event"
                              onClick={() => handleStatusChange(evt.id, "Published")}
                              className="h-8 w-8 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}

                          {/* Reject / Cancel Button */}
                          {evt.status !== "Cancelled" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Reject / Cancel Event"
                              onClick={() => handleStatusChange(evt.id, "Cancelled")}
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
                            onClick={() => handleDeleteEvent(evt.id)}
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
                  className="h-8 px-3 text-xs gap-1 border-slate-200 font-medium bg-white"
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
                          : "border-slate-200 text-slate-700 hover:bg-slate-50 bg-white"
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
                  className="h-8 px-3 text-xs gap-1 border-slate-200 font-medium bg-white"
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
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white text-slate-900 border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Create New Event
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-600">Event Title</label>
              <Input
                type="text"
                value={newEventData.title}
                onChange={(e) => setNewEventData({ ...newEventData, title: e.target.value })}
                placeholder="Enter event title"
                required
                className="bg-white border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-600">Organizer Name</label>
                <Input
                  type="text"
                  value={newEventData.organizer}
                  onChange={(e) => setNewEventData({ ...newEventData, organizer: e.target.value })}
                  placeholder="Organizer name"
                  required
                  className="bg-white border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-600">Category</label>
                <Select
                  value={newEventData.category}
                  onChange={(e) => setNewEventData({ ...newEventData, category: e.target.value })}
                  className="bg-white border-slate-200"
                >
                  <option value="Technology">Technology</option>
                  <option value="Design">Design</option>
                  <option value="Music">Music</option>
                  <option value="Business">Business</option>
                  <option value="Health">Health</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-600">City / Location</label>
                <Input
                  type="text"
                  value={newEventData.location}
                  onChange={(e) => setNewEventData({ ...newEventData, location: e.target.value })}
                  placeholder="e.g. San Francisco, CA"
                  required
                  className="bg-white border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-600">Venue</label>
                <Input
                  type="text"
                  value={newEventData.venue}
                  onChange={(e) => setNewEventData({ ...newEventData, venue: e.target.value })}
                  placeholder="e.g. Moscone Center"
                  className="bg-white border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-600">Date</label>
                <Input
                  type="text"
                  value={newEventData.date}
                  onChange={(e) => setNewEventData({ ...newEventData, date: e.target.value })}
                  placeholder="e.g. Oct 15, 2026"
                  required
                  className="bg-white border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-600">Seat Capacity</label>
                <Input
                  type="number"
                  value={newEventData.capacity}
                  onChange={(e) => setNewEventData({ ...newEventData, capacity: parseInt(e.target.value) || 100 })}
                  required
                  className="bg-white border-slate-200"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-600">Description</label>
              <Input
                type="text"
                value={newEventData.description}
                onChange={(e) => setNewEventData({ ...newEventData, description: e.target.value })}
                placeholder="Brief event description..."
                className="bg-white border-slate-200"
              />
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                className="border-slate-200 text-slate-600"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                Create Event
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}