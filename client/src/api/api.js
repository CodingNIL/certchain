import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// 🔐 TEMP TOKEN (paste from Postman)
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZWNmM2NmMzdmYThmOWIxZDk4ODcwYiIsImlhdCI6MTc3NzI4MTQ2NywiZXhwIjoxNzc3MzY3ODY3fQ.S0sVvmY6yMXsUqfNHXE3aVuusBeSWlktz86kDa_x0-0";

API.interceptors.request.use((req) => {
  if (TOKEN) {
    req.headers.Authorization = `Bearer ${TOKEN}`;
  }
  return req;
});
