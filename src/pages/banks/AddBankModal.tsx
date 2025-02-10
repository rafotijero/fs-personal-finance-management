import React, { useState } from "react";
import axios from "../../api/axiosConfig";
import { toast } from "react-toastify";
import GenericModal from "../common/GenericModal";
import FileUpload from "../../components/FileUpload"; // ✅ Importar FileUpload

interface AddBankModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: () => void;
}

const AddBankModal: React.FC<AddBankModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({ name: "", country: "", initials: "", logo: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Manejar la URL del logo subido
    const handleLogoUploadSuccess = (fileUrl: string) => {
        setFormData({ ...formData, logo: fileUrl });
        toast.success("✅ Logo subido correctamente.");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.logo) {
            toast.error("⚠️ Primero sube un logo antes de guardar el banco.");
            return;
        }

        try {
            await axios.post("/banks", formData);
            toast.success("✅ Banco agregado correctamente.");
            onAdd();
            onClose();
            setFormData({ name: "", country: "", initials: "", logo: "" });
        } catch (error) {
            console.error("❌ Error al agregar el banco:", error);
            toast.error("No se pudo agregar el banco.");
        }
    };

    return (
        <GenericModal title="Agregar Nuevo Banco" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} submitLabel="Agregar Banco">
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

            {/* ✅ Componente FileUpload para subir el logo */}
            <div className="mb-4">
                <label className="block text-gray-700">Logo</label>
                <FileUpload uploadUrl="/api/v1/uploads/images" onUploadSuccess={handleLogoUploadSuccess} fileType="image" />
                {formData.logo && (
                    <img
                        src={`${import.meta.env.VITE_API_URL}${formData.logo}`}
                        alt="Preview"
                        className="mt-2 w-16 h-16 object-cover rounded"
                    />
                )}
            </div>
        </GenericModal>
    );
};

export default AddBankModal;
