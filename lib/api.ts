import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000",
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

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        // Runs when the API request succeeds.
        console.log(
            `[API Response] ${response.status} ${response.config.url}`
        );

        return response;
    },
    (error) => {
        if (axios.isAxiosError(error)) {
            if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
                error.message = "Request timed out. Please try again.";
            } else if (!error.response) {
                error.message =
                    "Unable to connect to the server. Please make sure JSON Server is running.";
            } else {
                const status = error.response.status;
                const responseData = error.response.data as
                    | { message?: unknown }
                    | undefined;

                if (
                    typeof responseData?.message === "string" &&
                    responseData.message.trim()
                ) {
                    error.message = responseData.message;
                } else {
                    switch (status) {
                        case 400:
                            error.message = "Invalid request.";
                            break;
                        case 401:
                            error.message = "Unauthorized. Please check your credentials.";
                            break;
                        case 403:
                            error.message =
                                "You do not have permission to perform this action.";
                            break;
                        case 404:
                            error.message = "The requested resource was not found.";
                            break;
                        case 500:
                            error.message =
                                "Internal server error. Please try again later.";
                            break;
                        default:
                            error.message =
                                "Something went wrong. Please try again.";
                    }
                }
            }
        }

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
