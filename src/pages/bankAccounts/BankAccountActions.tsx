import React from "react";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { deleteBankAccount } from "../../api/bankAccountApi"; // ✅ Usamos la API centralizada
import { toast } from "react-toastify";
import { BankAccount } from "../../types";

interface BankAccountActionsProps {
    bankAccount: BankAccount;
    onEdit: (account: BankAccount) => void;
    onDelete: (id: number) => void;
    onViewDetails: (account: BankAccount) => void;
}

const BankAccountActions: React.FC<BankAccountActionsProps> = ({ bankAccount, onEdit, onDelete, onViewDetails }) => {
    // 🗑️ **Eliminar cuenta bancaria**
    const handleDelete = async () => {
        console.log("🗑️ Eliminando cuenta bancaria ID:", bankAccount.id);

        try {
            await deleteBankAccount(bankAccount.id);
            toast.success("✅ Cuenta bancaria eliminada correctamente.");
            onDelete(bankAccount.id); // 🔥 Solo ejecutamos si la eliminación fue exitosa
        } catch (error: any) {
            console.error("❌ Error al eliminar la cuenta bancaria:", error);
            toast.error(`⚠️ No se pudo eliminar la cuenta: ${error.response?.data?.message || error.message}`);
        }
    };


    return (
        <div className="flex justify-center space-x-3">
            {/* 👁️ Ver detalles */}
            <button
                onClick={() => onViewDetails(bankAccount)}
                className="text-gray-600 hover:text-gray-800"
                title="Ver detalles"
            >
                <FiEye size={18} />
            </button>

            {/* ✏️ Editar */}
            <button
                onClick={() => onEdit(bankAccount)}
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

export default BankAccountActions;
