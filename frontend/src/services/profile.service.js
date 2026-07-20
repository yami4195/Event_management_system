import axiosInstance from "../config/axios";

export const profileService = {
  getProfileByUserId: (userId) => axiosInstance.get(`/profiles/${userId}`),
  createProfile: (data) => axiosInstance.post("/profiles", data),
  updateProfile: (userId, data) => axiosInstance.put(`/profiles/${userId}`, data),
};
