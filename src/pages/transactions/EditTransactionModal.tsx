import React, { useState, useEffect } from "react";
import { updateTransaction } from "../../api/transactionApi";
import { toast } from "react-toastify";
import GenericModal from "../common/GenericModal";
import axios from "../../api/axiosConfig";
import { TransactionDTO } from "../../types";

interface EditTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: TransactionDTO | null;
    onUpdate: () => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ isOpen, onClose, transaction, onUpdate }) => {
    const [formData, setFormData] = useState({
        bankAccountId: "",
        transactionType: "INCOME",
        amount: "",
        transactionDate: "",
        description: "",
    });

    const [bankAccounts, setBankAccounts] = useState<{ id: number; accountNumber: string }[]>([]);

    useEffect(() => {
        if (isOpen) {
            fetchBankAccounts();
        }
    }, [isOpen]);

    useEffect(() => {
        if (transaction) {
            setFormData({
                bankAccountId: transaction.bankAccountId.toString(),
                transactionType: transaction.transactionType,
                amount: transaction.amount.toString(),
                transactionDate: transaction.transactionDate,
                description: transaction.description || "",
            });
        }
    }, [transaction]);

    const fetchBankAccounts = async () => {
        try {
            const response = await axios.get("/bank-accounts");
            setBankAccounts(response.data.data || []);
        } catch (error) {
            console.error("❌ Error al cargar cuentas bancarias:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.bankAccountId || !formData.amount || !formData.transactionDate) {
            toast.error("⚠️ Todos los campos obligatorios deben completarse.");
            return;
        }

        try {
            if (transaction) {
                await updateTransaction(transaction.id, {
                    bankAccountId: parseInt(formData.bankAccountId),
                    transactionType: formData.transactionType as "INCOME" | "EXPENSE",
                    amount: parseFloat(formData.amount),
                    transactionDate: new Date(formData.transactionDate).toISOString(),
                    description: formData.description || undefined,
                });

                toast.success("✅ Transacción actualizada correctamente.");
                onUpdate();
                onClose();
            }
        } catch (error: any) {
            console.error("❌ Error al actualizar la transacción:", error);
            toast.error(`⚠️ No se pudo actualizar la transacción: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <GenericModal title="Editar Transacción" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} submitLabel="Guardar Cambios">
            <div className="mb-4">
                <label className="block text-gray-700">Cuenta Bancaria</label>
                <select name="bankAccountId" value={formData.bankAccountId} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
                    {bankAccounts.map((account) => (
                        <option key={account.id} value={account.id}>
                            {account.accountNumber}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">Tipo de Transacción</label>
                <select name="transactionType" value={formData.transactionType} onChange={handleChange} className="w-full border rounded px-3 py-2">
                    <option value="INCOME">Ingreso</option>
                    <option value="EXPENSE">Egreso</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">Monto</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">Fecha</label>
                <input type="date" name="transactionDate" value={formData.transactionDate} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">Descripción (Opcional)</label>
                <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
        </GenericModal>
    );
};

export default EditTransactionModal;
