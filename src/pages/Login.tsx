import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosConfig";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post("/auth/login", { email, password });

            console.log("📌 Respuesta del backend:", response.data);

            const token = response.data?.data?.token;
            if (!token) {
                throw new Error("🚨 No se recibió token en la respuesta.");
            }

            login(token);
        } catch (err: any) {
            console.error("❌ Error en Login:", err.message);
            setError("Credenciales inválidas. Por favor, intenta de nuevo.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold text-center mb-6">Inicia sesión</h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Ingresa tu correo"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Ingresa tu contraseña"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Iniciar sesión
                    </button>
                </form>

                {/* 🔹 Enlace a la página de registro */}
                <p className="text-center text-gray-600 mt-4">
                    ¿No tienes cuenta?{" "}
                    <a href="/register" className="text-blue-600 hover:underline">
                        Regístrate aquí
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
