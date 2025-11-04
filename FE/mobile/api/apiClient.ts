import axios from "axios";
const apiClient = axios.create({
  baseURL: "https://68e63fad21dd31f22cc4c447.mockapi.io",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});
export default apiClient;
