import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 1000,
})

export function getApiErrorMessage(error: any): string {
    if (axios.isAxiosError(error)) {
        if(!error.response){
            return "Unable to connect to the server. Please make sure JSON Server is running.";
        }

        return(
            error.response.data?.message ??
            "Something went wrong. Please try again."
        );
    }

    return "An unexpected error occurred. Please try again.";
}

export default api;