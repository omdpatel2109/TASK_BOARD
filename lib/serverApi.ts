// import "server-only";

// import axios from "axios";
// import { cookies } from "next/headers";

// const COOKIE_NAME = "access_token";

// export const serverApi = axios.create({
//     baseURL: "http://localhost:3000",
//     headers: {
//         "Content-Type": "application/json",
//     },
//     timeout: 10000,
// });

// // Request interceptor
// serverApi.interceptors.request.use(
//     async (config) => {
//         const cookieStore = await cookies();

//         const token = cookieStore.get(COOKIE_NAME)?.value;

//         if (!token) {
//             throw new Error("Authentication required.");
//         }

//         config.headers.Authorization = `Bearer ${token}`;

//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // Response interceptor
// serverApi.interceptors.response.use(
//     (response) => response,
//     (error) => Promise.reject(error)
// );