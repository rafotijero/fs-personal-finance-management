import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // 🔥 Usamos la variable del .env
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
