import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://hype-beans-cafe-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
