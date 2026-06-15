import axios from "axios";

// Base URL must come from NEXT_PUBLIC_API_URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Global error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) {
      alert("Network error. Please check your connection.");
      return Promise.reject(err);
    }

    const status = err.response.status;

    if (status === 401) {
      alert("Session expired. Please log in again.");
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("adminToken");
        window.location.href = "/login";
      }
    }

    if (status === 403) {
      alert("You are not authorized to perform this action.");
    }

    if (status >= 500) {
      alert("Server error. Please try again later.");
    }

    return Promise.reject(err);
  }
);

// Optional manual override
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export default api;
