import React from "react";
import GenericModal from "../common/GenericModal";
import { TransactionDTO } from "../../types";

interface TransactionDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: TransactionDTO | null;
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({ isOpen, onClose, transaction }) => {
    if (!transaction) return null;

    // 📌 Construir la URL completa del archivo adjunto
    const fileUrl = transaction.receiptFilePath ? `${import.meta.env.VITE_API_URL}${transaction.receiptFilePath}` : null;

    // 📌 Detectar si el archivo adjunto es una imagen o un PDF
    const isImage = fileUrl ? /\.(png|jpe?g|gif)$/i.test(fileUrl) : false;
    const isPdf = fileUrl ? /\.pdf$/i.test(fileUrl) : false;

    return (
        <GenericModal title="Detalles de la Transacción" isOpen={isOpen} onClose={onClose}>
            <div className="p-4 bg-white rounded-lg shadow">
                <div className="mb-4">
                    <h3 className="text-lg font-bold">Tipo de Transacción</h3>
                    <p className="text-gray-700">{transaction.transactionType === "INCOME" ? "Ingreso" : "Egreso"}</p>
                </div>

                <div className="mb-4">
                    <h3 className="text-lg font-bold">Monto</h3>
                    <p className="text-green-600 font-semibold">${transaction.amount.toFixed(2)}</p>
                </div>

                <div className="mb-4">
                    <h3 className="text-lg font-bold">Fecha</h3>
                    <p className="text-gray-700">{new Date(transaction.transactionDate).toLocaleDateString()}</p>
                </div>

                {transaction.description && (
                    <div className="mb-4">
                        <h3 className="text-lg font-bold">Descripción</h3>
                        <p className="text-gray-700">{transaction.description}</p>
                    </div>
                )}

                {/* 📌 Mostrar archivo adjunto si existe */}
                {fileUrl && (
                    <div className="mb-4">
                        <h3 className="text-lg font-bold">Recibo</h3>
                        {isImage ? (
                            <img
                                src={fileUrl}
                                alt="Recibo"
                                className="mt-2 w-full max-w-xs rounded-lg border shadow-sm"
                            />
                        ) : isPdf ? (
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                📄 Ver PDF
                            </a>
                        ) : (
                            <p className="text-gray-500">Formato de archivo no compatible.</p>
                        )}
                    </div>
                )}

                {/* 📌 Si la transacción está eliminada, mostrar info */}
                {transaction.isDeleted === "1" && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        <h3 className="font-bold">Estado: Eliminada</h3>
                    </div>
                )}
            </div>
        </GenericModal>
    );
};

export default TransactionDetailsModal;
