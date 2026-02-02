import axios from "axios";
import type { ApiError } from "@/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const err: ApiError = {
      message: error.response?.data?.message || error.message || "Something went wrong",
      error: error.response?.data?.error,
    };
    return Promise.reject(err);
  }
);
