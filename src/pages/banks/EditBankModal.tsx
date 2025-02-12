import React, { useState, useEffect } from "react";
import axios from "../../api/axiosConfig";
import { toast } from "react-toastify";
import GenericModal from "../common/GenericModal";
import FileUpload from "../../components/FileUpload"; // ✅ Importamos FileUpload
import { Bank } from "../../types";

interface EditBankModalProps {
    isOpen: boolean;
    onClose: () => void;
    bank: Bank | null;
    onUpdate: () => void;
}

const EditBankModal: React.FC<EditBankModalProps> = ({ isOpen, onClose, bank, onUpdate }) => {
    const [formData, setFormData] = useState<Bank>({ id: 0, name: "", country: "", initials: "", logo: "" });

    useEffect(() => {
        if (bank) {
            setFormData({
                ...bank,
                // 🔥 Solo agrega la base URL si el logo no contiene la ruta completa
                //logo: bank.logo?.startsWith("/uploads") ? `${import.meta.env.VITE_API_URL}${bank.logo}` : bank.logo,
                logo: bank.logo,
            });
        }
    }, [bank]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Maneja la subida de una nueva imagen y actualiza el estado con la ruta relativa
    const handleLogoUploadSuccess = (fileUrl: string) => {
        setFormData({ ...formData, logo: fileUrl }); // Guardamos solo la ruta relativa
        toast.success("✅ Logo actualizado correctamente.");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // ✅ Asegúrate de enviar solo la ruta relativa al backend
            const payload = { ...formData, logo: formData.logo?.replace(import.meta.env.VITE_API_URL, "") };
            await axios.put(`/banks/${formData.id}`, payload);
            toast.success("✅ Banco actualizado correctamente.");
            onUpdate();
            onClose();
        } catch (error) {
            console.error("❌ Error al actualizar el banco:", error);
            toast.error("No se pudo actualizar el banco.");
        }
    };

    return (
        <GenericModal title="Editar Banco" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} submitLabel="Guardar Cambios">
            <div className="mb-4">
                <label className="block text-gray-700">Nombre</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">País</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Iniciales</label>
                <input type="text" name="initials" value={formData.initials} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>

            {/* 🔥 Sección para la imagen del banco */}
            <div className="mb-4">
                <label className="block text-gray-700">Logo</label>
                <FileUpload uploadUrl="/uploads" onUploadSuccess={handleLogoUploadSuccess} fileMode="image" />

                {/* ✅ Mostrar la imagen actual si existe */}
                {formData.logo && (
                    <img
                        src={`${import.meta.env.VITE_API_URL}${formData.logo}`}
                        alt="Logo Preview"
                        className="mt-2 w-16 h-16 object-cover rounded"
                    />
                )}
            </div>
        </GenericModal>
    );
};

export default EditBankModal;
