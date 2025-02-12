import React, { useState, useEffect } from "react";
import { createTransaction } from "../../api/transactionApi";
import { toast } from "react-toastify";
import GenericModal from "../common/GenericModal";
import axios from "../../api/axiosConfig";

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: () => void; // 🔄 Para actualizar la lista después de agregar
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        bankAccountId: "",
        transactionType: "INCOME",
        amount: "",
        transactionDate: "",
        description: "",
    });

    const [bankAccounts, setBankAccounts] = useState<{ id: number; accountNumber: string }[]>([]);

    // 🔄 **Cargar cuentas bancarias al abrir**
    useEffect(() => {
        if (isOpen) {
            fetchBankAccounts();
        }
    }, [isOpen]);

    const fetchBankAccounts = async () => {
        try {
            const response = await axios.get("/bank-accounts");
            setBankAccounts(response.data.data || []);
        } catch (error) {
            console.error("❌ Error al cargar cuentas bancarias:", error);
        }
    };

    // 📌 **Actualizar valores del formulario**
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ **Enviar formulario**
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.bankAccountId || !formData.amount || !formData.transactionDate) {
            toast.error("⚠️ Todos los campos obligatorios deben completarse.");
            return;
        }

        try {
            await createTransaction({
                id: 0, // Se generará en el backend
                bankAccountId: parseInt(formData.bankAccountId),
                transactionType: formData.transactionType as "INCOME" | "EXPENSE",
                amount: parseFloat(formData.amount),
                transactionDate: new Date(formData.transactionDate).toISOString(),
                description: formData.description || undefined,
                isDeleted: "0", // Nueva transacción siempre será activa
            });

            toast.success("✅ Transacción registrada correctamente.");
            onAdd(); // 🔄 Actualiza la lista de transacciones
            onClose();
            setFormData({ bankAccountId: "", transactionType: "INCOME", amount: "", transactionDate: "", description: "" });
        } catch (error: any) {
            console.error("❌ Error al registrar la transacción:", error);
            toast.error(`⚠️ No se pudo registrar la transacción: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <GenericModal title="Agregar Transacción" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} submitLabel="Registrar">
            {/* Cuenta bancaria */}
            <div className="mb-4">
                <label className="block text-gray-700">Cuenta Bancaria</label>
                <select name="bankAccountId" value={formData.bankAccountId} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
                    <option value="">Seleccione una cuenta</option>
                    {bankAccounts.map((account) => (
                        <option key={account.id} value={account.id}>
                            {account.accountNumber}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tipo de transacción */}
            <div className="mb-4">
                <label className="block text-gray-700">Tipo de Transacción</label>
                <select name="transactionType" value={formData.transactionType} onChange={handleChange} className="w-full border rounded px-3 py-2">
                    <option value="INCOME">Ingreso</option>
                    <option value="EXPENSE">Egreso</option>
                </select>
            </div>

            {/* Monto */}
            <div className="mb-4">
                <label className="block text-gray-700">Monto</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>

            {/* Fecha de transacción */}
            <div className="mb-4">
                <label className="block text-gray-700">Fecha</label>
                <input type="date" name="transactionDate" value={formData.transactionDate} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>

            {/* Descripción opcional */}
            <div className="mb-4">
                <label className="block text-gray-700">Descripción (Opcional)</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
        </GenericModal>
    );
};

export default AddTransactionModal;
