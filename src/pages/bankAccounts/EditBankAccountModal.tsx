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
}

const EditBankAccountModal: React.FC<EditBankAccountModalProps> = ({ isOpen, onClose, bankAccount, onUpdate }) => {
    const [formData, setFormData] = useState({
        accountDescription: "",
        accountNumber: "",
        balance: "",
        accountType: "SAVINGS",
        bankId: "",
        ownerId: "",
    });

    const [banks, setBanks] = useState<{ id: number; name: string }[]>([]);
    const [users, setUsers] = useState<{ id: number; name: string }[]>([]);

    // 🔄 **Cargar bancos y usuarios al abrir**
    useEffect(() => {
        if (isOpen) {
            fetchBanks();
            fetchUsers();
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

    const fetchUsers = async () => {
        try {
            const response = await axios.get("/users");
            setUsers(response.data.data || []);
        } catch (error) {
            console.error("❌ Error al cargar usuarios:", error);
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
                ownerId: bankAccount.owner.id.toString(),
            });
        }
    }, [bankAccount]);

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
                    ownerId: parseInt(formData.ownerId),
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

            {/* Propietario */}
            <div className="mb-4">
                <label className="block text-gray-700">Propietario</label>
                <select name="ownerId" value={formData.ownerId} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
                    <option value="">Seleccione un usuario</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </select>
            </div>
        </GenericModal>
    );
};

export default EditBankAccountModal;
