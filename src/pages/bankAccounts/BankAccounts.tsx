console.log("🟢 BankAccounts.tsx se está ejecutando");
import React, { useEffect, useState } from "react";
import {
    fetchBankAccounts
} from "../../api/bankAccountApi";
import BankAccountsTable from "./BankAccountTable";
import EditBankAccountModal from "./EditBankAccountModal";
import AddBankAccountModal from "./AddBankAccountModal";
import { toast } from "react-toastify";
import { BankAccount } from "../../types";

const BankAccounts: React.FC = () => {
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(null);

    // 🔄 **Cargar lista de cuentas bancarias**
    const loadBankAccounts = async () => {
        try {
            const accounts = await fetchBankAccounts();
            setBankAccounts(accounts);
        } catch (error) {
            console.error("❌ Error al cargar las cuentas bancarias:", error);
            toast.error("⚠️ No se pudieron cargar las cuentas bancarias.");
        }
    };

    useEffect(() => {
        loadBankAccounts();
    }, []);

    // ➕ **Abrir modal para agregar cuenta**
    const handleAdd = () => {
        setAddModalOpen(true);
    };

    // ✏️ **Abrir modal de edición**
    const handleEdit = (account: BankAccount) => {
        setSelectedBankAccount(account);
        setEditModalOpen(true);
    };

    // 🗑️ **Eliminar cuenta bancaria**
    const handleDelete = async (id: number) => {
        console.log("🔍 Ejecutando handleDelete para ID:", id);

        // 🚨 No vuelvas a llamar deleteBankAccount aquí, ya se ejecutó en BankAccountActions.tsx
        setBankAccounts((prevAccounts) => prevAccounts.filter((account) => account.id !== id));
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Gestión de Cuentas Bancarias</h1>

            {/* ➕ Botón para agregar cuenta bancaria */}
            <button
                onClick={handleAdd}
                className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                Agregar Cuenta Bancaria
            </button>

            {/* 📌 Tabla de cuentas bancarias */}
            <BankAccountsTable bankAccounts={bankAccounts} onEdit={handleEdit} onDelete={handleDelete} />

            {/* 🛠️ Modales */}
            <EditBankAccountModal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                bankAccount={selectedBankAccount}
                onUpdate={loadBankAccounts}
            />
            <AddBankAccountModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} onAdd={loadBankAccounts} />
        </div>
    );
};

export default BankAccounts;
