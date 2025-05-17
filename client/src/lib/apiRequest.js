import axios from "axios";


const apiRequest = axios.create({
  baseURL: "http://localhost:8800/api",
  withCredentials: true, // ✅ Important for sending cookies like JWT
});


// Add token if stored in localStorage
apiRequest.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiRequest;

