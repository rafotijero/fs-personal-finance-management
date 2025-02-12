import React, { useState, useEffect } from "react";
import { createTransaction } from "../../api/transactionApi";
import { toast } from "react-toastify";
import GenericModal from "../common/GenericModal";
import axios from "../../api/axiosConfig";
import FileUpload from "../../components/FileUpload"; // ✅ Un solo FileUpload

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        bankAccountId: "",
        transactionType: "INCOME",
        amount: "",
        transactionDate: "",
        description: "",
        receiptFilePath: "", // ✅ Guarda la URL del archivo subido
    });

    const [bankAccounts, setBankAccounts] = useState<{ id: number; accountNumber: string }[]>([]);

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

    // 📌 Manejar la URL del archivo subido (imagen o PDF)
    const handleFileUploadSuccess = (fileUrl: string) => {
        setFormData({ ...formData, receiptFilePath: fileUrl });
        toast.success("✅ Archivo subido correctamente.");
    };

    // ✅ Enviar formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.bankAccountId || !formData.amount || !formData.transactionDate) {
            toast.error("⚠️ Todos los campos obligatorios deben completarse.");
            return;
        }

        try {
            await createTransaction({
                id: 0,
                bankAccountId: parseInt(formData.bankAccountId),
                transactionType: formData.transactionType as "INCOME" | "EXPENSE",
                amount: parseFloat(formData.amount),
                transactionDate: new Date(formData.transactionDate).toISOString(),
                description: formData.description || undefined,
                receiptFilePath: formData.receiptFilePath, // ✅ Se envía la URL del archivo al backend
                isDeleted: "0",
            });

            toast.success("✅ Transacción registrada correctamente.");
            onAdd();
            onClose();
            setFormData({
                bankAccountId: "",
                transactionType: "INCOME",
                amount: "",
                transactionDate: "",
                description: "",
                receiptFilePath: "",
            });
        } catch (error: any) {
            console.error("❌ Error al registrar la transacción:", error);
            toast.error(`⚠️ No se pudo registrar la transacción: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <GenericModal title="Agregar Transacción" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} submitLabel="Registrar">
            <div className="mb-4">
                <label className="block text-gray-700">Cuenta Bancaria</label>
                <select
                    name="bankAccountId"
                    value={formData.bankAccountId}
                    onChange={(e) => setFormData({ ...formData, bankAccountId: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    required
                >
                    <option value="">Seleccione una cuenta</option>
                    {bankAccounts.map((account) => (
                        <option key={account.id} value={account.id}>
                            {account.accountNumber}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">Tipo de Transacción</label>
                <select
                    name="transactionType"
                    value={formData.transactionType}
                    onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                >
                    <option value="INCOME">Ingreso</option>
                    <option value="EXPENSE">Egreso</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">Monto</label>
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">Fecha</label>
                <input
                    type="date"
                    name="transactionDate"
                    value={formData.transactionDate}
                    onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">Archivo adjunto (Opcional)</label>
                <FileUpload uploadUrl="/uploads" onUploadSuccess={handleFileUploadSuccess} fileMode="both" />
            </div>
        </GenericModal>
    );
};

export default AddTransactionModal;
