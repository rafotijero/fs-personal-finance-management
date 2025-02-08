import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Definir la estructura del usuario autenticado
interface AuthContextType {
    user: { email: string; role: "ADMIN" | "USER" } | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

// Crear el contexto con valores iniciales
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para acceder al contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
};

// **PROVEEDOR DEL CONTEXTO**
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                          children,
                                                                      }) => {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );
    const [user, setUser] = useState<{ email: string; role: "ADMIN" | "USER" } | null>(
        null
    );

    const navigate = useNavigate();

    // **FUNCIÓN PARA INICIAR SESIÓN**
    const login = (newToken: string) => {
        if (!newToken) {
            throw new Error("Token inválido recibido");
        }

        localStorage.setItem("token", newToken);
        setToken(newToken);

        try {
            // Decodificar el token
            const payload = JSON.parse(atob(newToken.split(".")[1]));
            setUser({ email: payload.sub, role: payload.roles[0] }); // roles[0] asume que solo hay un rol
            navigate("/dashboard");
        } catch (error) {
            throw new Error("Error al decodificar el token");
        }
    };



    // **FUNCIÓN PARA CERRAR SESIÓN**
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        navigate("/");
    };

    // **CARGAR DATOS DEL USUARIO AL RECARGAR LA PÁGINA**
    useEffect(() => {
        if (token) {
            try {
                // 🚨 Validación: Solo intenta decodificar si el token es un JWT válido
                if (token.split(".").length !== 3) {
                    console.warn("Token inválido en localStorage, eliminando...");
                    localStorage.removeItem("token");
                    setToken(null);
                    return;
                }

                const payload = JSON.parse(atob(token.split(".")[1]));
                setUser({ email: payload.email, role: payload.role });
            } catch (error) {
                console.error("Error al decodificar el token:", error);
                localStorage.removeItem("token"); // Limpiar si el token es corrupto
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
