import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 1000,
});

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
