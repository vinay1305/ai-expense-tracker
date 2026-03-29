// services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-expense-tracker-ti3d.onrender.com/api"
});
// attach token automatically
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default API;