import axiosInstance from "../config/axios";

/**
 * Dashboard Service
 * Provides API endpoints for user dashboard stats
 */
export const dashboardService = {
  /**
   * Get user dashboard statistics
   */
  getStats: async () => {
    try {
      const res = await axiosInstance.get("/dashboard/stats");
      return res.data;
    } catch (error) {
      console.error("Dashboard stats API failed", error);
      throw error;
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
      console.error("Dashboard activity API failed", error);
      throw error;
    }
  },
};
