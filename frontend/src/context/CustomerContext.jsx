import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { registrationsService } from "../services/registrations.service";
import { notificationsService } from "../services/notifications.service";
import useAuth from "../hooks/useAuth";

const CustomerContext = createContext(null);

export function CustomerProvider({ children }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const fetchCustomerData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [regRes, notifRes] = await Promise.all([
        registrationsService.getMyRegistrations().catch(() => ({ data: { data: { registrations: [] } } })),
        notificationsService.getAll().catch(() => ({ data: { data: { notifications: [] } } })),
      ]);

      const list = regRes.data?.data?.registrations ?? [];
      setRegistrations(Array.isArray(list) ? list : []);

      const rawNotifs = notifRes.data?.data?.notifications ?? notifRes.data?.notifications ?? [];
      const mappedNotifs = rawNotifs.map((n) => ({
        id: n.notification_id || n.id,
        title: n.type === "cancellation" ? "Cancellation Notice" : n.type === "reminder" ? "Event Reminder" : "Event Update",
        message: n.message,
        timestamp: n.sent_at
          ? new Date(n.sent_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
          : "Recently",
        read: Boolean(n.is_read),
      }));

      setNotifications(mappedNotifs);
    } catch (err) {
      console.error("Failed to load customer data:", err);
      setError("Failed to load your event registrations and alerts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchCustomerData();
    }
  }, [user, fetchCustomerData]);

  // Derived stats
  const stats = {
    registeredEvents: registrations.length,
    upcomingEvents: registrations.filter((r) => r.status?.toLowerCase() === "upcoming" || r.status?.toLowerCase() === "confirmed").length,
    completedEvents: registrations.filter((r) => r.status?.toLowerCase() === "completed").length,
    unreadNotifications: notifications.filter((n) => !n.read).length,
  };

  const cancelRegistration = async (registrationId) => {
    try {
      await registrationsService.cancelRegistration(registrationId);
      setRegistrations((prev) => prev.filter((r) => r.id !== registrationId && `${r.user_id}_${r.event_id}` !== registrationId));
      return { success: true, message: "Registration cancelled successfully." };
    } catch (err) {
      console.error("Cancel registration error:", err);
      return { success: false, message: err.response?.data?.message || err.message || "Failed to cancel registration." };
    }
  };

  const markNotificationRead = async (id) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Mark read error:", err);
      // Update local state even if API fails
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    }
  };

  return (
    <CustomerContext.Provider
      value={{
        loading,
        error,
        registrations,
        notifications,
        stats,
        refreshData: fetchCustomerData,
        cancelRegistration,
        markNotificationRead,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
}
