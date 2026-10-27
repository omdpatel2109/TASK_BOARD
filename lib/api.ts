import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3001",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 1000,
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        // Runs before every API request.
        console.log(
            `[API Request] ${config.method?.toUpperCase()} ${config.url}`
        );

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Reusable error-message helper
export function getApiErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        return error.message ||
            "Something went wrong. Please try again.";
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Something went wrong. Please try again.";
}
