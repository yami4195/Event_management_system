import { useState, useEffect, useCallback } from "react";
import { organizerService } from "../services/organizerService";
import { filterEvents, sortEvents, paginateItems } from "../utils/organizerHelpers";

export function useOrganizer() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [settings, setSettings] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Load summary and events
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, evtsRes, regsRes, analyticsRes, settingsRes] = await Promise.all([
        organizerService.getDashboardSummary(),
        organizerService.getEvents(),
        organizerService.getRegistrations(),
        organizerService.getAnalytics(),
        organizerService.getSettings(),
      ]);

      if (sumRes.success) {
        setSummary(sumRes.data.summary);
        setNotifications(sumRes.data.notifications || []);
      }
      if (evtsRes.success) setEvents(evtsRes.data);
      if (regsRes.success) setRegistrations(regsRes.data);
      if (analyticsRes.success) setAnalytics(analyticsRes.data);
      if (settingsRes.success) setSettings(settingsRes.data);
    } catch (err) {
      console.error("Failed to load organizer data:", err);
      setError("Failed to load organizer dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derived filtered & sorted events
  const filteredEvents = filterEvents(events, searchQuery, statusFilter, categoryFilter);
  const sortedEventsList = sortEvents(filteredEvents, sortBy, sortOrder);
  const paginatedEvents = paginateItems(sortedEventsList, currentPage, pageSize);

  // Actions
  const handleCreateEvent = async (eventData) => {
    const res = await organizerService.createEvent(eventData);
    if (res.success) {
      await fetchData();
    }
    return res;
  };

  const handleUpdateEvent = async (id, eventData) => {
    const res = await organizerService.updateEvent(id, eventData);
    if (res.success) {
      await fetchData();
    }
    return res;
  };

  const handleDeleteEvent = async (id) => {
    const res = await organizerService.deleteEvent(id);
    if (res.success) {
      await fetchData();
    }
    return res;
  };

  const handleToggleCheckIn = async (registrationId) => {
    const res = await organizerService.toggleCheckIn(registrationId);
    if (res.success) {
      setRegistrations((prev) =>
        prev.map((r) => (r.id === registrationId ? res.data : r))
      );
    }
    return res;
  };

  const handleUpdateSettings = async (newSettings) => {
    const res = await organizerService.updateSettings(newSettings);
    if (res.success) {
      setSettings(res.data);
    }
    return res;
  };

  return {
    loading,
    error,
    summary,
    events,
    filteredEvents: sortedEventsList,
    paginatedEvents,
    registrations,
    analytics,
    settings,
    notifications,

    // Controls
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
    setPageSize,

    // Methods
    refresh: fetchData,
    createEvent: handleCreateEvent,
    updateEvent: handleUpdateEvent,
    deleteEvent: handleDeleteEvent,
    toggleCheckIn: handleToggleCheckIn,
    updateSettings: handleUpdateSettings,
  };
}
