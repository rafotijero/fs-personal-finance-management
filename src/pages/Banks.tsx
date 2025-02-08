import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";

interface Bank {
    id: number;
    name: string;
    country: string;
}

const Banks: React.FC = () => {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [newBank, setNewBank] = useState({ name: "", country: "" });
    const [error, setError] = useState<string | null>(null);

    // **Cargar lista de bancos desde el backend**
    useEffect(() => {
        axios.get("/banks")
            .then((response) => {
                console.log("✅ Respuesta del backend:", response.data); // 🔍 DEBUG
                if (response.data.data) {
                    setBanks(response.data.data);
                } else {
                    setError("Respuesta inesperada del servidor");
                }
            })
            .catch((error) => {
                console.error("❌ Error al cargar los bancos", error);
                setError("No se pudieron cargar los bancos.");
            });
    }, []);

// **Agregar nuevo banco**
    const handleAddBank = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post("/banks", newBank);
            setBanks([...banks, response.data.data]); // Asegurar que se accede a .data.data
            setNewBank({ name: "", country: "" });
        } catch (error) {
            console.error("❌ Error al agregar el banco", error);
            setError("No se pudo agregar el banco.");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Gestión de Bancos</h1>

            {error && <p className="text-red-500">{error}</p>}

            {/* Tabla de Bancos */}
            <table className="w-full border">
                <thead>
                <tr>
                    <th className="border px-4 py-2">ID</th>
                    <th className="border px-4 py-2">Nombre</th>
                    <th className="border px-4 py-2">País</th>
                    <th className="border px-4 py-2">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {banks.map((bank) => (
                    <tr key={bank.id}>
                        <td className="border px-4 py-2">{bank.id}</td>
                        <td className="border px-4 py-2">{bank.name}</td>
                        <td className="border px-4 py-2">{bank.country}</td>
                        <td className="border px-4 py-2">
                            <button className="text-blue-500 mr-2">Editar</button>
                            <button className="text-red-500">Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Formulario para agregar banco */}
            <form onSubmit={handleAddBank} className="mt-6">
                <h2 className="text-xl font-bold mb-4">Agregar Banco</h2>
                <div className="mb-4">
                    <label className="block text-gray-700">Nombre</label>
                    <input
                        type="text"
                        value={newBank.name}
                        onChange={(e) => setNewBank({ ...newBank, name: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">País</label>
                    <input
                        type="text"
                        value={newBank.country}
                        onChange={(e) => setNewBank({ ...newBank, country: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Agregar Banco
                </button>
            </form>
        </div>
    );
};

export default Banks;

