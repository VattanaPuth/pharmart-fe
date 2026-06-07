import axios from "axios";
import toast from "react-hot-toast";

const DEFAULT_API_URL = "http://127.0.0.1:8000/api";

const normalizeApiUrl = (url) => {
  const baseUrl = (url || DEFAULT_API_URL).replace(/\/+$/, "");

  return baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
};

const isProtectedPage = (pathname) =>
  pathname.startsWith("/owner") ||
  pathname.startsWith("/user") ||
  pathname.startsWith("/admin");

const api = axios.create({
  baseURL: normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL),
  timeout: 30000,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isHandling401 = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 && !isHandling401) {
      isHandling401 = true;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        if (
          isProtectedPage(window.location.pathname) &&
          window.location.pathname !== "/login"
        ) {
          toast.error("Unauthorized");
          window.location.href = "/login";
        }
      }

      setTimeout(() => {
        isHandling401 = false;
      }, 2000);
    }

    return Promise.reject(error);
  }
);

export default api;
