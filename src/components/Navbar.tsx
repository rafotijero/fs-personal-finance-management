import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center max-w-6xl">
                {/* 📌 Logo */}
                <h1 className="text-xl font-bold">
                    <Link to="/dashboard">Gestor de Finanzas</Link>
                </h1>

                {/* 📌 Botón de menú en móviles */}
                <button
                    className="md:hidden text-white focus:outline-none"
                    onClick={() => setMenuOpen(!isMenuOpen)}
                >
                    ☰
                </button>

                {/* 📌 Menú de navegación */}
                <div className={`md:flex md:space-x-6 ${isMenuOpen ? "flex flex-col items-center" : "hidden"} md:flex-row md:items-center absolute md:static bg-blue-600 md:bg-transparent top-16 left-0 w-full md:w-auto text-center md:text-left p-4 md:p-0`}>
                    <Link to="/dashboard" className="block md:inline-block px-4 py-2 hover:bg-blue-700 rounded">
                        Resumen
                    </Link>
                    <Link to="/banks" className="block md:inline-block px-4 py-2 hover:bg-blue-700 rounded">
                        Bancos
                    </Link>
                    <Link to="/accounts" className="block md:inline-block px-4 py-2 hover:bg-blue-700 rounded">
                        Cuentas Bancarias
                    </Link>
                    <Link to="/transactions" className="block md:inline-block px-4 py-2 hover:bg-blue-700 rounded">
                        Transacciones
                    </Link>
                    {user?.role === "ADMIN" && (
                        <Link to="/admin" className="block md:inline-block px-4 py-2 hover:bg-blue-700 rounded">
                            Administración
                        </Link>
                    )}
                    <button onClick={handleLogout} className="block md:inline-block px-4 py-2 hover:bg-red-700 rounded">
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
