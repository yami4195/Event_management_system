import axiosInstance from "../config/axios";

/**
 * Dashboard Service
 * Provides API endpoints for user dashboard stats, with mock data fallbacks
 * while the backend is being finalized.
 */

// Mock Data Fallbacks
const MOCK_STATS = {
  totalEvents: 12,
  upcomingEvents: 3,
  registeredEvents: 5,
};

const MOCK_RECENT_ACTIVITY = [
  {
    id: "act-1",
    type: "REGISTRATION",
    message: "You registered for React Advanced Workshop",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "act-2",
    type: "PAYMENT",
    message: "Payment of $49.00 confirmed for React Advanced Workshop",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2.5).toISOString(),
  },
  {
    id: "act-3",
    type: "EVENT_UPDATE",
    message: "Tech Conference 2026 schedule has been updated.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
];

export const dashboardService = {
  /**
   * Get user dashboard statistics
   */
  getStats: async () => {
    try {
      const res = await axiosInstance.get("/dashboard/stats");
      return res.data;
    } catch (error) {
      console.warn("Using mock dashboard stats (API unavailable/failed)");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: MOCK_STATS,
          });
        }, 500); // 500ms network delay simulation
      });
    }
  },

  /**
   * Get user's recent activity feed
   */
  getRecentActivity: async () => {
    try {
      const res = await axiosInstance.get("/dashboard/activity");
      return res.data;
    } catch (error) {
      console.warn("Using mock recent activity (API unavailable/failed)");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: MOCK_RECENT_ACTIVITY,
          });
        }, 500);
      });
    }
  },
};
