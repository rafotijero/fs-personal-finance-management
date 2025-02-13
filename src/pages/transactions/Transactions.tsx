import React, { useEffect, useState } from "react";
import { getTransactionsByUser, deleteTransaction } from "../../api/transactionApi";
import TransactionTable from "./TransactionTable";
import EditTransactionModal from "./EditTransactionModal";
import AddTransactionModal from "./AddTransactionModal";
import { toast } from "react-toastify";
import { TransactionDTO } from "../../types";
import { jwtDecode } from "jwt-decode";

const Transactions: React.FC = () => {
    const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionDTO | null>(null);

    // 🔄 **Cargar lista de transacciones**
    const loadTransactions = async () => {
        try {
            // 🔑 Obtener el token del almacenamiento (localStorage o sessionStorage)
            const token = localStorage.getItem("token"); // Asegúrate de haber guardado el token aquí
            if (!token) {
                console.warn("⚠️ No hay token disponible.");
                return;
            }

            // 🔍 Decodificar el token para extraer el userId
            const decodedToken: any = jwtDecode(token);
            const userId = decodedToken?.id || decodedToken?.userId; // Depende de cómo se llama el campo en el backend

            if (!userId) {
                console.error("❌ No se pudo obtener el ID del usuario del token.");
                return;
            }

            // 🔄 Obtener transacciones del usuario autenticado
            const data = await getTransactionsByUser(userId);
            setTransactions(data);
        } catch (error) {
            console.error("❌ Error al cargar transacciones:", error);
            toast.error("⚠️ No se pudieron cargar las transacciones.");
        }
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    // ➕ **Abrir modal para agregar transacción**
    const handleAdd = () => {
        setAddModalOpen(true);
    };

    // ✏️ **Abrir modal de edición**
    const handleEdit = (transaction: TransactionDTO) => {
        setSelectedTransaction(transaction);
        setEditModalOpen(true);
    };

    // 🗑️ **Eliminar transacción**
    const handleDelete = async (id: number) => {
        console.log("🔍 Ejecutando handleDelete para ID:", id);
        try {
            await deleteTransaction(id);
            setTransactions((prevTransactions) => prevTransactions.filter((transaction) => transaction.id !== id));
            toast.success("✅ Transacción eliminada correctamente.");
        } catch (error) {
            console.error("❌ Error al eliminar la transacción:", error);
            toast.error("⚠️ No se pudo eliminar la transacción.");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Gestión de Transacciones</h1>

            {/* ➕ Botón para agregar transacción */}
            <button
                onClick={handleAdd}
                className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Agregar Transacción
            </button>

            {/* 📌 Tabla de transacciones */}
            <TransactionTable transactions={transactions} onEdit={handleEdit} onDelete={handleDelete} />

            {/* 🛠️ Modales */}
            <EditTransactionModal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                transaction={selectedTransaction}
                onUpdate={loadTransactions}
            />
            <AddTransactionModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} onAdd={loadTransactions} />
        </div>
    );
};

export default Transactions;
