import axios from "axios";

export const API = axios.create({
  baseURL: "https://certchain-i5nw.onrender.com/api"
});

// AUTO ATTACH TOKEN
API.interceptors.request.use((req) => {

  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});
