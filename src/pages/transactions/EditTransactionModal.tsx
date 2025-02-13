import React, { useState, useEffect } from "react";
import { updateTransaction } from "../../api/transactionApi";
import { toast } from "react-toastify";
import GenericModal from "../common/GenericModal";
import axios from "../../api/axiosConfig";
import { TransactionDTO } from "../../types";
import FileUpload from "../../components/FileUpload"; // ✅ Importamos el componente de subida de archivos
import { jwtDecode } from "jwt-decode";

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
        receiptFilePath: "", // ✅ Guardar la URL del archivo adjunto
    });

    const [bankAccounts, setBankAccounts] = useState<{ id: number; accountDescription: string }[]>([]);

    // 🔑 Obtener userId y userName desde el token
    const token = localStorage.getItem("token");

    let owner: { id: number; name: string } | null = null;

    if (token) {
        try {
            const decodedToken: any = jwtDecode(token);

            if (!decodedToken?.id && !decodedToken?.userId) {
                throw new Error("❌ No se encontró un ID de usuario en el token.");
            }

            owner = {
                id: decodedToken.id ?? decodedToken.userId,
                name: decodedToken.name ?? "Usuario",
            };
        } catch (error) {
            console.error("❌ Error al decodificar el token:", error);
            owner = null; // Si hay un error, asigna null
        }
    }

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
                receiptFilePath: transaction.receiptFilePath || "", // ✅ Cargar la ruta del archivo adjunto
            });
        }
    }, [transaction]);

    const fetchBankAccounts = async () => {
        if (!owner) {
            console.error("⚠️ No hay usuario autenticado, no se pueden obtener cuentas bancarias.");
            return;
        }

        try {
            const response = await axios.get(`/bank-accounts/owner/${owner.id}`);
            setBankAccounts(response.data.data || []);
        } catch (error) {
            console.error("❌ Error al cargar cuentas bancarias:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Manejar la URL del archivo subido (imagen o PDF)
    const handleFileUploadSuccess = (fileUrl: string) => {
        setFormData({ ...formData, receiptFilePath: fileUrl });
        toast.success("✅ Archivo actualizado correctamente.");
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
                    receiptFilePath: formData.receiptFilePath, // ✅ Se envía la URL del archivo al backend
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
                <select
                    name="bankAccountId"
                    value={formData.bankAccountId}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                >
                    {bankAccounts.map((account) => (
                        <option key={account.id} value={account.id}>
                            {account.accountDescription}
                        </option>
                    ))}
                </select>
            </div>

            {/* Descripción de la Cuenta */}
            <div className="mb-4">
                <label className="block text-gray-700">Descripción de la Cuenta</label>
                <input
                    type="text"
                    name="accountDescription"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    required />
            </div>


            <div className="mb-4">
                <label className="block text-gray-700">Tipo de Transacción</label>
                <select
                    name="transactionType"
                    value={formData.transactionType}
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">Descripción (Opcional)</label>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            {/* ✅ Subida de archivo adjunto */}
            <div className="mb-4">
                <label className="block text-gray-700">Archivo adjunto (Opcional)</label>
                <FileUpload uploadUrl="/uploads" onUploadSuccess={handleFileUploadSuccess} fileMode="both" />

                {/* ✅ Mostrar archivo actual si existe */}
                {formData.receiptFilePath && (
                    <div className="mt-2">
                        <label className="block text-gray-700">Archivo actual:</label>
                        <a
                            href={`${import.meta.env.VITE_API_URL}${formData.receiptFilePath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            Ver archivo
                        </a>
                    </div>
                )}
            </div>
        </GenericModal>
    );
};

export default EditTransactionModal;
