import React from "react";
import GenericModal from "../common/GenericModal";
import { BankAccount } from "../../types";

interface BankAccountDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    bankAccount: BankAccount | null;
}

const BankAccountDetailsModal: React.FC<BankAccountDetailsModalProps> = ({ isOpen, onClose, bankAccount }) => {
    if (!bankAccount) return null;

    return (
        <GenericModal title="Detalles de la Cuenta Bancaria" isOpen={isOpen} onClose={onClose}>
            <div className="p-4 bg-white rounded-lg shadow">
                <div className="mb-4">
                    <h3 className="text-lg font-bold">Número de Cuenta</h3>
                    <p className="text-gray-700">{bankAccount.accountNumber}</p>
                </div>

                <div className="mb-4">
                    <h3 className="text-lg font-bold">Saldo</h3>
                    <p className="text-green-600 font-semibold">${bankAccount.balance.toFixed(2)}</p>
                </div>

                <div className="mb-4">
                    <h3 className="text-lg font-bold">Tipo de Cuenta</h3>
                    <p className="text-gray-700">{bankAccount.accountType === "SAVINGS" ? "Ahorro" : "Corriente"}</p>
                </div>

                <div className="mb-4">
                    <h3 className="text-lg font-bold">Banco</h3>
                    <p className="text-gray-700">{bankAccount.bank.name}</p>
                </div>

                <div className="mb-4">
                    <h3 className="text-lg font-bold">Propietario</h3>
                    <p className="text-gray-700">{bankAccount.owner.name}</p>
                </div>

                {/* Si la cuenta está eliminada, mostrar info */}
                {bankAccount.isDeleted === "1" && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        <h3 className="font-bold">Estado: Eliminada</h3>
                    </div>
                )}
            </div>
        </GenericModal>
    );
};

export default BankAccountDetailsModal;
