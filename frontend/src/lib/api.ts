import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://Libroniq-sw7j.onrender.com",
});

export default api;