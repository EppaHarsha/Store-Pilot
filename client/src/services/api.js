import axios from "axios";

const baseURL = "http://localhost:3001/api";

export const api = axios.create({
  baseURL,
  timeout: 8000
});

api.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

