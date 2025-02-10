import React from "react";
import GenericModal from "../common/GenericModal";
import { Bank } from "../../types";

interface BankDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    bank: Bank | null;
}

const BankDetailsModal: React.FC<BankDetailsModalProps> = ({ isOpen, onClose, bank }) => {
    if (!bank) return null;

    return (
        <GenericModal title="Detalles del Banco" isOpen={isOpen} onClose={onClose} submitLabel="Cerrar" onSubmit={onClose}>
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold">Nombre</label>
                <p className="border px-3 py-2 rounded bg-gray-100">{bank.name}</p>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold">País</label>
                <p className="border px-3 py-2 rounded bg-gray-100">{bank.country}</p>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold">Iniciales</label>
                <p className="border px-3 py-2 rounded bg-gray-100">{bank.initials}</p>
            </div>
            {bank.logo && (
                <div className="mb-4 text-center">
                    <label className="block text-gray-700 font-semibold">Logo</label>
                    <img src={`${import.meta.env.VITE_API_URL}${bank.logo}`} alt="Logo" className="mt-2 w-24 h-24 object-cover rounded mx-auto" />
                </div>
            )}
        </GenericModal>
    );
};

export default BankDetailsModal;
