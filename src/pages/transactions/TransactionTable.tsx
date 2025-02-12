import React, { useState } from "react";
import { TransactionDTO } from "../../types";
import TransactionActions from "./TransactionActions";
import TransactionDetailsModal from "./TransactionDetailsModal";

interface TransactionsTableProps {
    transactions: TransactionDTO[];
    onEdit: (transaction: TransactionDTO) => void;
    onDelete: (id: number) => void;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions, onEdit, onDelete }) => {
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionDTO | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const handleViewDetails = (transaction: TransactionDTO) => {
        setSelectedTransaction(transaction);
        setIsDetailsModalOpen(true);
    };

    return (
        <div className="p-6">
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border shadow-lg">
                    <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="border px-4 py-2">Tipo</th>
                        <th className="border px-4 py-2">Monto</th>
                        <th className="border px-4 py-2">Fecha</th>
                        <th className="border px-4 py-2">Descripción</th>
                        <th className="border px-4 py-2">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id} className="text-center hover:bg-gray-100">
                            <td className="border px-4 py-2">
                                {transaction.transactionType === "INCOME" ? (
                                    <span className="text-green-600 font-semibold">Ingreso</span>
                                ) : (
                                    <span className="text-red-600 font-semibold">Egreso</span>
                                )}
                            </td>
                            <td className="border px-4 py-2 font-semibold">
                                ${transaction.amount.toFixed(2)}
                            </td>
                            <td className="border px-4 py-2">{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                            <td className="border px-4 py-2">{transaction.description || "-"}</td>
                            <td className="border px-4 py-2 flex justify-center space-x-2">
                                <TransactionActions
                                    onEdit={() => onEdit(transaction)}
                                    onDelete={() => onDelete(transaction.id)}
                                    onViewDetails={() => handleViewDetails(transaction)}
                                    transaction={transaction}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de detalles */}
            <TransactionDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                transaction={selectedTransaction}
            />
        </div>
    );
};

export default TransactionsTable;
