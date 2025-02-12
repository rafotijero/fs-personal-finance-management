import React from "react";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { TransactionDTO } from "../../types";
import { toast } from "react-toastify";

interface TransactionActionsProps {
    transaction: TransactionDTO;
    onEdit: (transaction: TransactionDTO) => void;
    onDelete: (id: number) => void;
    onViewDetails: (transaction: TransactionDTO) => void;
}

const TransactionActions: React.FC<TransactionActionsProps> = ({ transaction, onEdit, onDelete, onViewDetails }) => {
    // 🗑️ **Eliminar transacción**
    const handleDelete = async () => {
        console.log("🗑️ Eliminando transacción ID:", transaction.id);

        try {
            onDelete(transaction.id);
            toast.success("✅ Transacción eliminada correctamente.");
        } catch (error: any) {
            console.error("❌ Error al eliminar la transacción:", error);
            toast.error(`⚠️ No se pudo eliminar la transacción: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="flex justify-center space-x-3">
            {/* 👁️ Ver detalles */}
            <button
                onClick={() => onViewDetails(transaction)}
                className="text-gray-600 hover:text-gray-800"
                title="Ver detalles"
            >
                <FiEye size={18} />
            </button>

            {/* ✏️ Editar */}
            <button
                onClick={() => onEdit(transaction)}
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
        </div>
    );
};

export default TransactionActions;
