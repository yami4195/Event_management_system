import axiosInstance from "../config/axios";

/**
 * Feedback Service
 */
export const feedbackService = {
  getByEventId: (eventId) => axiosInstance.get(`/events/${eventId}/feedback`),
  submit: (data) => axiosInstance.post("/feedback", data),
  update: (id, data) => axiosInstance.put(`/feedback/${id}`, data),
  delete: (id) => axiosInstance.delete(`/feedback/${id}`),
};
