import React, { useState } from "react";
import { BankAccount } from "../../types";
import BankAccountActions from "./BankAccountActions"; // ✅ Acciones para editar/eliminar
import BankAccountDetailsModal from "./BankAccountDetailsModal"; // ✅ Modal de detalles

interface BankAccountsTableProps {
    bankAccounts: BankAccount[];
    onEdit: (account: BankAccount) => void;
    onDelete: (id: number) => Promise<void>;
}

const BankAccountsTable: React.FC<BankAccountsTableProps> = ({ bankAccounts, onEdit, onDelete }) => {
    const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    // ✅ **Abrir modal de detalles**
    const handleViewDetails = (account: BankAccount) => {
        setSelectedAccount(account);
        setIsDetailsModalOpen(true);
    };

    return (
        <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border">
                <thead>
                <tr className="bg-gray-200">
                    <th className="border px-4 py-2">Número de Cuenta</th>
                    <th className="border px-4 py-2">Saldo</th>
                    <th className="border px-4 py-2">Tipo de Cuenta</th>
                    <th className="border px-4 py-2">Banco</th>
                    <th className="border px-4 py-2">Propietario</th>
                    <th className="border px-4 py-2">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {bankAccounts.map((account) => (
                    <tr key={account.id} className="text-center">
                        <td className="border px-4 py-2">{account.accountNumber}</td>
                        <td className="border px-4 py-2 text-green-600 font-semibold">${account.balance.toFixed(2)}</td>
                        <td className="border px-4 py-2">
                            {account.accountType === "SAVINGS" ? "Ahorro" : "Corriente"}
                        </td>
                        <td className="border px-4 py-2">{account.bank.name}</td>
                        <td className="border px-4 py-2">{account.owner.name}</td>
                        <td className="border px-4 py-2">
                            <BankAccountActions
                                onEdit={() => onEdit(account)}
                                onDelete={onDelete}  // ✅ Pasamos directamente la función sin encapsularla
                                onViewDetails={() => handleViewDetails(account)}
                                bankAccount={account}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* ✅ Modal de detalles */}
            <BankAccountDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                bankAccount={selectedAccount}
            />
        </div>
    );
};

export default BankAccountsTable;
