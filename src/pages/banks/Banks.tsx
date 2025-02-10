import React, { useEffect, useState } from "react";
import axios from "../../api/axiosConfig";
import BanksTable from "./BanksTable";
import EditBankModal from "./EditBankModal";
import AddBankModal from "./AddBankModal";
import { toast } from "react-toastify";
import { Bank } from "../../types";

const Banks: React.FC = () => {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

    // 🔄 **Cargar lista de bancos**
    const fetchBanks = async () => {
        try {
            const response = await axios.get("/banks");
            setBanks(response.data.data || []);
        } catch (error: any) {
            console.error("❌ Error al cargar los bancos:", error);
            toast.error("⚠️ No se pudieron cargar los bancos.");
        }
    };

    useEffect(() => {
        fetchBanks();
    }, []);

    // ✏️ **Abrir modal de edición**
    const handleEdit = (bank: Bank) => {
        setSelectedBank(bank);
        setEditModalOpen(true);
    };

    // 🗑️ **Eliminar banco**
    const handleDelete = async (id: number) => {
        try {
            const response = await axios.delete(`/banks/${id}`);

            if (response.status === 200 || response.status === 204) {
                toast.success("✅ Banco eliminado correctamente."); // ✅ Notificación aquí
                setBanks((prevBanks) => prevBanks.filter((bank) => bank.id !== id));
            } else {
                throw new Error(`Respuesta inesperada del servidor: ${response.status}`);
            }
        } catch (error: any) {
            console.error("❌ Error al eliminar el banco:", error);
            toast.error(`⚠️ No se pudo eliminar el banco: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Gestión de Bancos</h1>

            {/* ➕ Botón para agregar banco */}
            <button
                onClick={() => setAddModalOpen(true)}
                className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                Agregar Banco
            </button>

            {/* 📌 Tabla de bancos */}
            <BanksTable banks={banks} onEdit={handleEdit} onDelete={handleDelete} />

            {/* 🛠️ Modales */}
            <EditBankModal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                bank={selectedBank}
                onUpdate={fetchBanks}
            />
            <AddBankModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} onAdd={fetchBanks} />
        </div>
    );
};

export default Banks;
