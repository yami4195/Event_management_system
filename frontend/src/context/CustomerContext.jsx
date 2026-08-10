import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { registrationsService } from "../services/registrations.service";
import useAuth from "../hooks/useAuth";

const CustomerContext = createContext(null);

export function CustomerProvider({ children }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: "n1", title: "Registration Confirmed", message: "Your ticket for Tech Summit 2026 is confirmed!", timestamp: "10 mins ago", read: false },
    { id: "n2", title: "Event Reminder", message: "Design Workshop starts tomorrow at 10:00 AM.", timestamp: "2 hours ago", read: false },
    { id: "n3", title: "Venue Update", message: "Hall B added for Addis Developers Expo.", timestamp: "1 day ago", read: true },
  ]);

  const fetchCustomerData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await registrationsService.getMyRegistrations();
      const list = res.data?.data?.registrations ?? [];
      setRegistrations(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load customer registrations:", err);
      setError("Failed to load your event registrations.");
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
      if (registrationsService.cancelRegistration) {
        await registrationsService.cancelRegistration(registrationId);
      }
      setRegistrations((prev) => prev.filter((r) => r.id !== registrationId && r.registration_id !== registrationId));
      return { success: true, message: "Registration cancelled successfully." };
    } catch (err) {
      console.error("Cancel registration error:", err);
      return { success: false, message: err.message || "Failed to cancel registration." };
    }
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
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
