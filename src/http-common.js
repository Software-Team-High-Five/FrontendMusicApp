import axios from "axios";

export default axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? "http://localhost:3025/performance-t5" : "/performance-t5",
  headers: { "Content-Type": "application/json" }
});