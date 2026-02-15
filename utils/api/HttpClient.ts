import axios from "axios";

// Create an Axios instance
const httpClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

import { getLocalItemAsync, LocalStorageKey } from "../helpers/Storage";

// Request interceptor
httpClient.interceptors.request.use(
  async (config) => {
    const token = await getLocalItemAsync(LocalStorageKey.SESSION);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (__DEV__) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
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
