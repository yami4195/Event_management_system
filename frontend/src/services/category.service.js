import axiosInstance from "../config/axios";

/** Categories Service */
export const categoriesService = {
  getAll: () => axiosInstance.get("/categories"),
  getById: (id) => axiosInstance.get(`/categories/${id}`),
};
