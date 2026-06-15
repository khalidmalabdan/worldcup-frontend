import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach token automatically (browser only)
api.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const token =
    localStorage.getItem("token") || localStorage.getItem("adminAccess");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Global error handling (browser only)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (typeof window === "undefined") {
      return Promise.reject(err);
    }

    if (!err.response) {
      alert("Network error. Please check your connection.");
      return Promise.reject(err);
    }

    const status = err.response.status;

    if (status === 401) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      localStorage.removeItem("adminAccess");
      window.location.href = "/login";
    } else if (status === 403) {
      alert("You are not authorized to perform this action.");
    } else if (status >= 500) {
      alert("Server error. Please try again later.");
    }

    return Promise.reject(err);
  }
);

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export default api;
