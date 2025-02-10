import React, { useState } from "react";
import { Bank } from "../../types";
import BankActions from "./BankActions";
import BankDetailsModal from "./BankDetailsModal"; // ✅ Importamos el modal de detalles

interface BanksTableProps {
    banks: Bank[];
    onEdit: (bank: Bank) => void;
    onDelete: (id: number) => void;
}

const BanksTable: React.FC<BanksTableProps> = ({ banks, onEdit, onDelete }) => {
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    // ✅ Función para abrir el modal con los detalles del banco
    const handleViewDetails = (bank: Bank) => {
        setSelectedBank(bank);
        setIsDetailsModalOpen(true);
    };

    return (
        <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border">
                <thead>
                <tr className="bg-gray-200">
                    <th className="border px-4 py-2">Nombre</th>
                    <th className="border px-4 py-2">País</th>
                    <th className="border px-4 py-2">Iniciales</th>
                    <th className="border px-4 py-2">Logo</th>
                    <th className="border px-4 py-2">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {banks.map((bank) => (
                    <tr key={bank.id} className="text-center">
                        <td className="border px-4 py-2">{bank.name}</td>
                        <td className="border px-4 py-2">{bank.country}</td>
                        <td className="border px-4 py-2">{bank.initials}</td>
                        <td className="border px-4 py-2">
                            {bank.logo ? (
                                <img src={`${import.meta.env.VITE_API_URL}${bank.logo}`} alt="Logo" className="w-14 h-14 object-cover rounded" />
                            ) : (
                                <div className="w-14 h-14 bg-gray-300 rounded flex items-center justify-center">❌</div>
                            )}
                        </td>
                        <td className="border px-4 py-2">
                            <BankActions
                                onEdit={() => onEdit(bank)}
                                onDelete={() => onDelete(bank.id)}
                                onViewDetails={() => handleViewDetails(bank)} // ✅ Pasamos la función
                                bank={bank}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* ✅ Modal de detalles */}
            <BankDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} bank={selectedBank} />
        </div>
    );
};

export default BanksTable;
