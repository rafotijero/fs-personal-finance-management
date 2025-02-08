import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">
                    <Link to="/dashboard">Gestor de Finanzas</Link>
                </h1>
                <div className="flex space-x-4">
                    <Link to="/dashboard" className="hover:underline">
                        Resumen
                    </Link>
                    <Link to="/transactions" className="hover:underline">
                        Transacciones
                    </Link>
                    <Link to="/accounts" className="hover:underline">
                        Cuentas Bancarias
                    </Link>
                    <Link to="/banks" className="hover:underline">
                        Bancos
                    </Link>
                    {user?.role === "ADMIN" && (
                        <Link to="/admin" className="hover:underline">
                            Administración
                        </Link>
                    )}
                    <button onClick={handleLogout} className="hover:underline">
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
