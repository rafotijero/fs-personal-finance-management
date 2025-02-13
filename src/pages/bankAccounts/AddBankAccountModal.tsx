import React, { useState, useEffect } from "react";
import { createBankAccount } from "../../api/bankAccountApi"; // ✅ Importamos la función centralizada
import { toast } from "react-toastify";
import GenericModal from "../common/GenericModal";
import axios from "../../api/axiosConfig";


interface AddBankAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: () => void; // 🔄 Para actualizar la lista después de agregar
}

const AddBankAccountModal: React.FC<AddBankAccountModalProps> = ({ isOpen, onClose, onAdd }) => {
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
            await createBankAccount({
                accountDescription: formData.accountDescription,
                accountNumber: formData.accountNumber,
                balance: parseFloat(formData.balance),
                accountType: formData.accountType as "SAVINGS" | "CHECKING",
                bankId: parseInt(formData.bankId),
                ownerId: parseInt(formData.ownerId),
            });

            toast.success("✅ Cuenta bancaria creada correctamente.");
            onAdd(); // 🔄 Actualiza la lista de cuentas
            onClose();
            setFormData({ accountDescription:"", accountNumber: "", balance: "", accountType: "SAVINGS", bankId: "", ownerId: "" });
        } catch (error: any) {
            console.error("❌ Error al crear la cuenta bancaria:", error);
            toast.error(`⚠️ No se pudo crear la cuenta: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <GenericModal title="Agregar Cuenta Bancaria" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} submitLabel="Crear Cuenta">
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

export default AddBankAccountModal;
