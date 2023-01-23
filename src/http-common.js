import axios from "axios";
export default axios.create({
  base: process.env.NODE_ENV === 'development' ? "http://localhost/" : "/performance-t5",
  headers: { "Content-Type": "application/json" }
});