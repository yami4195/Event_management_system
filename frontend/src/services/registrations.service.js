import axiosInstance from "../config/axios";

export const registrationsService = {
  register: (eventId) =>
    axiosInstance.post("/registrations", { event_id: eventId }),
  getMyRegistrations: () => axiosInstance.get("/registrations/my"),
};
