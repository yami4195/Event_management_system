import axiosInstance from "../config/axios";

/**
 * Registrations Service
 */
export const registrationsService = {
  register: (eventId) =>
    axiosInstance.post("/registrations", { event_id: eventId }),
  getMyRegistrations: () => axiosInstance.get("/registrations/my"),
  getAll: (params) => axiosInstance.get("/registrations", { params }),
  getByEventId: (eventId) => axiosInstance.get(`/events/${eventId}/registrations`),
  updateStatus: (registrationId, status) =>
    axiosInstance.patch(`/registrations/${registrationId}/status`, { status }),
  cancelRegistration: (registrationId) =>
    axiosInstance.delete(`/registrations/${registrationId}`),
};
