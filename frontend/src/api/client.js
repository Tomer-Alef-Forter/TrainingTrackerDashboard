import axios from "axios";

const client = axios.create({
  // Override with VITE_API_BASE (e.g. for an isolated test backend).
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8000",
});

export default client;
