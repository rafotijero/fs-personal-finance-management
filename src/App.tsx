import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Overview from "./pages/Overview";
import Login from "./pages/Login";
import Banks from "./pages/banks/Banks.tsx";
import { useAuth } from "./context/AuthContext";
import {ToastContainer} from "react-toastify";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token } = useAuth();
    return token ? <>{children}</> : <Navigate to="/" />;
};

function App() {
    const { token } = useAuth();

    console.log("TOKEN ACTUAL:", token); // 👀 Verificar qué valor tiene el token

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            {token ? <Navbar /> : null} {/* Solo se renderiza si hay token */}

            <Routes>
                <Route path="/" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Overview />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/banks"
                    element={
                        <ProtectedRoute>
                            <Banks />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    );
}

export default App;
