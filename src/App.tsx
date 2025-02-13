import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Overview from "./pages/Overview";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Banks from "./pages/banks/Banks.tsx";
import { useAuth } from "./context/AuthContext";
import {ToastContainer} from "react-toastify";
import BankAccounts from "./pages/bankAccounts/BankAccounts.tsx";
import Transactions from "./pages/transactions/Transactions.tsx";

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
                <Route path="/register" element={<Register />} />
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
                <Route
                    path="/accounts"
                    element={
                        <ProtectedRoute>
                            <BankAccounts />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/transactions"
                    element={
                        <ProtectedRoute>
                            <Transactions />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    );
}

export default App;
