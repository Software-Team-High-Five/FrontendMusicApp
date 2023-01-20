import axios from "axios";
export default axios.create({
  base: process.env.NODE_ENV === 'development' ? "http://localhost/<>" : "<route>",
  headers: { "Content-Type": "application/json" }
});