import axios from "axios";

const api = axios.create({
  baseURL: "https://skill-based-barter-system.onrender.com/api",
  withCredentials: true,
});

export default api;
