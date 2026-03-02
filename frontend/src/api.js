import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",

});

export const register = (data) => api.post("api/auth/register", data);
export const login = (data) => api.post("api/auth/login", data);

// 👉 Users
export const getUsers = () => api.get("api/users");
export const getUser = (userId) => api.get(`api/users/${userId}`);
export const deleteUser = (userId) => api.delete(`api/users/${userId}`);

// 👉 Section API
export const createSection = (data) => api.post("api/sections/create", data);
export const getSections = () => api.get("api/sections/");
export const getSpeakingTests = () => api.get("api/sections?skill=speaking");
export const getWritingTests = () => api.get("api/sections?skill=writing");

// 👉 Writing
export const createWritingQuestion = (formData) =>api.post("api/writing/", formData);
export const getWritingBySection = (sectionId) =>api.get(`api/writing/section/${sectionId}`);

// 👉 Chấm điểm Writing (AI)
export const scoreWritingQ1_5 = (formData) =>api.post("api/writing/q1_5", formData);
export const scoreWritingQ6_7 = (formData) =>api.post("api/writing/q6_7", formData);
export const scoreWritingQ8 = (formData) =>api.post("api/writing/q8", formData);

// 👉 Speaking: tạo câu hỏi
export const createSpeakingQuestion = (formData) =>api.post("api/speaking/", formData);
// 👉 Lấy câu hỏi theo section
export const getSpeakingBySection = (sectionId) =>api.get(`api/speaking/section/${sectionId}`);

// 👉 Speaking AI chấm điểm
export const scoreSpeakingQ1_2 = (formData) =>api.post("api/speaking/q1-2", formData);
export const scoreSpeakingQ3_4 = (formData) =>api.post("api/speaking/q3-4", formData);
export const scoreSpeakingQ5_7 = (formData) =>api.post("api/speaking/q5-7", formData);
export const scoreSpeakingQ8_10 = (formData) =>api.post("api/speaking/q8-10", formData);
export const scoreSpeakingQ11 = (formData) =>api.post("api/speaking/q11", formData);

export default api;
