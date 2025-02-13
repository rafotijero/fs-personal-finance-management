import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
    user: { email: string; role: "ADMIN" | "USER" } | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [user, setUser] = useState<{ email: string; role: "ADMIN" | "USER" } | null>(null);
    const navigate = useNavigate();

    // 🔹 **FUNCIÓN PARA INICIAR SESIÓN**
    const login = (newToken: string) => {
        if (!newToken) {
            throw new Error("Token inválido recibido");
        }

        localStorage.setItem("token", newToken);
        setToken(newToken);

        try {
            const payload = JSON.parse(atob(newToken.split(".")[1]));

            console.log("🔍 Payload decodificado:", payload);

            if (!payload || !payload.roles || payload.roles.length === 0) {
                throw new Error("🚨 El token no contiene información de roles.");
            }

            const normalizedRole = payload.roles[0].replace("ROLE_", "");
            setUser({ email: payload.sub, role: normalizedRole as "ADMIN" | "USER" });
        } catch (error) {
            console.error("❌ Error al decodificar el token:", error);
            localStorage.removeItem("token");
            setToken(null);
        }
    };

    // 🔹 **REDIRECCIÓN DESPUÉS DE AUTENTICACIÓN**
    useEffect(() => {
        if (user) {
            console.log("📌 Redirigiendo a /dashboard...");
            navigate("/dashboard");
        }
    }, [user]);

    // 🔹 **FUNCIÓN PARA CERRAR SESIÓN**
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        navigate("/");
    };

    // 🔹 **CARGAR DATOS DEL USUARIO AL RECARGAR LA PÁGINA**
    useEffect(() => {
        if (token) {
            try {
                if (token.split(".").length !== 3) {
                    console.warn("Token inválido en localStorage, eliminando...");
                    localStorage.removeItem("token");
                    setToken(null);
                    return;
                }

                const payload = JSON.parse(atob(token.split(".")[1]));
                const normalizedRole = payload.roles[0].replace("ROLE_", "");

                setUser({ email: payload.email, role: normalizedRole as "ADMIN" | "USER" });
            } catch (error) {
                console.error("Error al decodificar el token:", error);
                localStorage.removeItem("token");
                setToken(null);
            }
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
