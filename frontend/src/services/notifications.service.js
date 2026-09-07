import axiosInstance from "../config/axios";

/**
 * Notifications Service
 */
export const notificationsService = {
  getAll: () => axiosInstance.get("/notifications"),
  getById: (id) => axiosInstance.get(`/notifications/${id}`),
  create: (data) => axiosInstance.post("/notifications", data),
  markAsRead: (id) => axiosInstance.patch(`/notifications/${id}/read`),
  delete: (id) => axiosInstance.delete(`/notifications/${id}`),
};
