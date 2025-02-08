import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8081/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor para agregar el token en cada solicitud, excepto en /auth/login
axiosInstance.interceptors.request.use((config) => {
    if (!config.url?.includes("/auth/login")) {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default axiosInstance;
