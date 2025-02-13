import React, { useState, useEffect } from "react";
import { updateBankAccount } from "../../api/bankAccountApi"; // ✅ Importamos la función centralizada
import { toast } from "react-toastify";
import GenericModal from "../common/GenericModal";
import { BankAccount } from "../../types";
import axios from "../../api/axiosConfig";

interface EditBankAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    bankAccount: BankAccount | null;
    onUpdate: () => void; // 🔄 Para actualizar la lista después de editar
    owner: { id: number; name: string } | null; // ✅ Se recibe el owner desde BankAccounts
}

const EditBankAccountModal: React.FC<EditBankAccountModalProps> = ({ isOpen, onClose, bankAccount, onUpdate, owner }) => {
    const [formData, setFormData] = useState({
        accountDescription: "",
        accountNumber: "",
        balance: "",
        accountType: "SAVINGS",
        bankId: "",
        ownerId: owner?.id ?? 0, // ✅ Se asigna el ID correctamente
    });

    const [banks, setBanks] = useState<{ id: number; name: string }[]>([]);

    // 🔄 **Cargar bancos al abrir**
    useEffect(() => {
        if (isOpen) {
            fetchBanks();
        }
    }, [isOpen]);

    const fetchBanks = async () => {
        try {
            const response = await axios.get("/banks");
            setBanks(response.data.data || []);
        } catch (error) {
            console.error("❌ Error al cargar bancos:", error);
        }
    };

    // 🔄 **Actualizar formulario cuando se seleccione una cuenta**
    useEffect(() => {
        if (bankAccount) {
            setFormData({
                accountDescription: bankAccount.accountDescription,
                accountNumber: bankAccount.accountNumber,
                balance: bankAccount.balance.toString(),
                accountType: bankAccount.accountType,
                bankId: bankAccount.bank.id.toString(),
                ownerId: owner?.id ?? 0, // ✅ Se asigna el owner desde BankAccounts
            });
        }
    }, [bankAccount, owner]);

    // 📌 **Actualizar valores del formulario**
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ **Enviar formulario**
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.accountNumber || !formData.balance || !formData.bankId || !formData.ownerId) {
            toast.error("⚠️ Todos los campos son obligatorios.");
            return;
        }

        try {
            if (bankAccount) {
                await updateBankAccount(bankAccount.id, {
                    accountDescription: formData.accountDescription,
                    accountNumber: formData.accountNumber,
                    balance: parseFloat(formData.balance),
                    accountType: formData.accountType as "SAVINGS" | "CHECKING",
                    bankId: parseInt(formData.bankId),
                    ownerId: formData.ownerId, // ✅ Se envía como número
                });

                toast.success("✅ Cuenta bancaria actualizada correctamente.");
                onUpdate(); // 🔄 Actualiza la lista de cuentas
                onClose();
            }
        } catch (error: any) {
            console.error("❌ Error al actualizar la cuenta bancaria:", error);
            toast.error(`⚠️ No se pudo actualizar la cuenta: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <GenericModal title="Editar Cuenta Bancaria" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} submitLabel="Guardar Cambios">
            {/* Banco */}
            <div className="mb-4">
                <label className="block text-gray-700">Banco</label>
                <select name="bankId" value={formData.bankId} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
                    <option value="">Seleccione un banco</option>
                    {banks.map((bank) => (
                        <option key={bank.id} value={bank.id}>
                            {bank.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Descripción de la Cuenta */}
            <div className="mb-4">
                <label className="block text-gray-700">Descripción de la Cuenta</label>
                <input type="text" name="accountDescription" value={formData.accountDescription} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>

            {/* Número de Cuenta */}
            <div className="mb-4">
                <label className="block text-gray-700">Número de Cuenta</label>
                <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>

            {/* Saldo */}
            <div className="mb-4">
                <label className="block text-gray-700">Saldo</label>
                <input type="number" name="balance" value={formData.balance} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>

            {/* Tipo de Cuenta */}
            <div className="mb-4">
                <label className="block text-gray-700">Tipo de Cuenta</label>
                <select name="accountType" value={formData.accountType} onChange={handleChange} className="w-full border rounded px-3 py-2">
                    <option value="SAVINGS">Ahorro</option>
                    <option value="CHECKING">Corriente</option>
                </select>
            </div>

            {/* ID del Propietario (Solo lectura) */}
            <div className="hidden">
                <label className="block text-gray-700">ID del Propietario</label>
                <input type="number" name="ownerId" value={formData.ownerId} readOnly className="w-full border rounded px-3 py-2 bg-gray-200" />
            </div>
        </GenericModal>
    );
};

export default EditBankAccountModal;
