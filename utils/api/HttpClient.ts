import axios from "axios";

// Create an Axios instance
const httpClient = axios.create({
  baseURL: "https://hebrew-backend-8sozbbz4w-faeiz17s-projects.vercel.app/api", // Or your mock base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
httpClient.interceptors.request.use(
  (config) => {
    // Basic request logging or token attachment can go here
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("[API Error]", error);
    return Promise.reject(error);
  },
);

export default httpClient;
