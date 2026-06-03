import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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

      toast.error("Unauthorized");

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");

        window.location.href = "/login";
      }

      setTimeout(() => {
        isHandling401 = false;
      }, 2000);
    }

    return Promise.reject(error);
  }
);

export default api;