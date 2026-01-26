import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",

});

export const register = (data) => api.post("api/auth/register", data);
export const login = (data) => api.post("api/auth/login", data);

export default api;
