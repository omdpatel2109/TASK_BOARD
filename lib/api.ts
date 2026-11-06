import axios from "axios";
export const api = axios.create({
    baseURL: "/api/proxy",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

// Reusable error-message helper
export function getApiErrorMessage(error: any): string {
    if(axios.isAxiosError(error)){
        return (
            error.response?.data?.message ||
            error.message ||
            "Something went wrong. Please try again."
        );
    }

    if(error instanceof Error){
        return error.message;
    }
    return "Something went wrong. Please try again.";
}
