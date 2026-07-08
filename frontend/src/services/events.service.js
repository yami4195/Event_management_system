import axiosInstance from "../config/axios";

/** Events Service */
export const eventsService = {
  getAll: (params) => axiosInstance.get("/events", { params }),
  getById: (id) => axiosInstance.get(`/events/${id}`),
  create: (data) => axiosInstance.post("/events", data),
  update: (id, data) => axiosInstance.put(`/events/${id}`, data),
  delete: (id) => axiosInstance.delete(`/events/${id}`),
  register: (id) => axiosInstance.post(`/events/${id}/register`),
};
