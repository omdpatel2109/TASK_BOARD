import axios from "axios";
import { cookies } from "next/headers";

const COOKIE_NAME = "access_token";

export const authApi = axios.create({
  baseURL: "https://dummyjson.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor
authApi.interceptors.request.use(
  async (config) => {
    if(config.url === "/auth/login"){
      return config;
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if(token){
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
authApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);