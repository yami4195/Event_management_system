import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { organizerService } from "../services/organizerService";
import { filterEvents, sortEvents, paginateItems } from "../utils/organizerHelpers";
import useAuth from "../hooks/useAuth";

export const OrganizerContext = createContext(null);

export function OrganizerProvider({ children }) {
  const { user } = useAuth();
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

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, evtsRes, regsRes, analyticsRes, settingsRes] = await Promise.all([
        organizerService.getDashboardSummary().catch((err) => {
          console.warn("getDashboardSummary error:", err);
          return { success: false };
        }),
        organizerService.getEvents().catch((err) => {
          console.warn("getEvents error:", err);
          return { success: false, data: [] };
        }),
        organizerService.getRegistrations().catch((err) => {
          console.warn("getRegistrations error:", err);
          return { success: false, data: [] };
        }),
        organizerService.getAnalytics().catch((err) => {
          console.warn("getAnalytics error:", err);
          return { success: false };
        }),
        organizerService.getSettings(user?.id).catch((err) => {
          console.warn("getSettings error:", err);
          return { success: false };
        }),
      ]);

      if (sumRes && sumRes.success && sumRes.data) {
        setSummary(sumRes.data.summary);
        setNotifications(sumRes.data.notifications || []);
      }
      if (evtsRes && evtsRes.success && Array.isArray(evtsRes.data)) {
        setEvents(evtsRes.data);
      }
      if (regsRes && regsRes.success && Array.isArray(regsRes.data)) {
        setRegistrations(regsRes.data);
      }
      if (analyticsRes && analyticsRes.success && analyticsRes.data) {
        setAnalytics(analyticsRes.data);
      }
      if (settingsRes && settingsRes.success && settingsRes.data) {
        setSettings(settingsRes.data);
      }
    } catch (err) {
      console.error("Failed to load organizer data:", err);
      setError("Failed to load organizer data. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derived filtered & sorted events
  const filteredEvents = filterEvents(events, searchQuery, statusFilter, categoryFilter);
  const sortedEventsList = sortEvents(filteredEvents, sortBy, sortOrder);
  const paginatedEvents = paginateItems(sortedEventsList, currentPage, pageSize);

  const handleCreateEvent = async (eventData) => {
    const res = await organizerService.createEvent(eventData);
    if (res.success) await fetchData();
    return res;
  };

  const handleUpdateEvent = async (id, eventData) => {
    const res = await organizerService.updateEvent(id, eventData);
    if (res.success) await fetchData();
    return res;
  };

  const handleDeleteEvent = async (id) => {
    const res = await organizerService.deleteEvent(id);
    if (res.success) await fetchData();
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
    const res = await organizerService.updateSettings(user?.id, newSettings);
    if (res.success) setSettings(res.data);
    return res;
  };

  const value = {
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

    refresh: fetchData,
    createEvent: handleCreateEvent,
    updateEvent: handleUpdateEvent,
    deleteEvent: handleDeleteEvent,
    toggleCheckIn: handleToggleCheckIn,
    updateSettings: handleUpdateSettings,
  };

  return <OrganizerContext.Provider value={value}>{children}</OrganizerContext.Provider>;
}

export function useOrganizer() {
  const context = useContext(OrganizerContext);
  if (!context) {
    throw new Error("useOrganizer must be used within an OrganizerProvider");
  }
  return context;
}
