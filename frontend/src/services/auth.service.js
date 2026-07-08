import axiosInstance from "../config/axios";

/** Auth Service */
export const authService = {
  login: (credentials) => axiosInstance.post("/auth/login", credentials),
  register: (data) => axiosInstance.post("/auth/register", data),
  logout: () => axiosInstance.post("/auth/logout"),
  getProfile: () => axiosInstance.get("/auth/me"),
};
