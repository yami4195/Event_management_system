import axiosInstance from "../config/axios";

/** Events Service */
export const eventsService = {
  getAll: (params) => axiosInstance.get("/events", { params }),
  getById: (id) => axiosInstance.get(`/events/${id}`),
  create: (formData) =>
    axiosInstance.post("/events", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    axiosInstance.put(`/events/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => axiosInstance.delete(`/events/${id}`),
};
