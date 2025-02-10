import React from "react";
import { FiEdit, FiTrash2, FiRefreshCcw, FiEye } from "react-icons/fi";
import axios from "../../api/axiosConfig";
import { toast } from "react-toastify";
import { Bank } from "../../types";

interface BankActionsProps {
    bank: Bank;
    onEdit: (bank: Bank) => void;
    onDelete: (id: number) => void;
    onViewDetails: (bank: Bank) => void; // ✅ Nuevo: Callback para ver detalles
}

const BankActions: React.FC<BankActionsProps> = ({ bank, onEdit, onDelete, onViewDetails }) => {
    // 🗑️ **Eliminar banco**
    const handleDelete = async () => {
        try {
            await axios.delete(`/banks/${bank.id}`);
            onDelete(bank.id); // ✅ Actualiza la lista en `Banks.tsx`
        } catch (error: any) {
            console.error("❌ Error al eliminar el banco:", error);
            toast.error(`⚠️ No se pudo eliminar el banco: ${error.response?.data?.message || error.message}`);
        }
    };

    // ♻️ **Restaurar banco**
    const handleRestore = async () => {
        try {
            await axios.patch(`/banks/${bank.id}/restore`);
            toast.success("✅ Banco restaurado correctamente.");
        } catch (error: any) {
            console.error("❌ Error al restaurar el banco:", error);
            toast.error(`⚠️ No se pudo restaurar el banco: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="flex justify-center space-x-3">
            {/* 👁️ Ver detalles */}
            <button
                onClick={() => onViewDetails(bank)}
                className="text-gray-600 hover:text-gray-800"
                title="Ver detalles"
            >
                <FiEye size={18} />
            </button>

            {/* ✏️ Editar */}
            <button
                onClick={() => onEdit(bank)}
                className="text-blue-500 hover:text-blue-700"
                title="Editar"
            >
                <FiEdit size={18} />
            </button>

            {/* 🗑️ Eliminar */}
            <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700"
                title="Eliminar"
            >
                <FiTrash2 size={18} />
            </button>

            {/* ♻️ Restaurar */}
            <button
                onClick={handleRestore}
                className="text-green-500 hover:text-green-700"
                title="Restaurar"
            >
                <FiRefreshCcw size={18} />
            </button>
        </div>
    );
};

export default BankActions;
