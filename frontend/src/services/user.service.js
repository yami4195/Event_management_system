import axiosInstance from "../config/axios";

/**
 * User Service
 * Admin management and individual user profile retrieval
 */
export const userService = {
  getAll: (params) => axiosInstance.get("/users", { params }),
  getById: (id) => axiosInstance.get(`/users/${id}`),
  update: (id, data) => axiosInstance.put(`/users/${id}`, data),
  delete: (id) => axiosInstance.delete(`/users/${id}`),
};
