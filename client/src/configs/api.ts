import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_STRAPI_API_URL,
})

export const getApiErrorMessage = (error: unknown, fallback = "Something went wrong") => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.error?.message || error.message || fallback;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
};

export default api;
