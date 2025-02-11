import React from "react";

interface GenericModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (e: React.FormEvent) => void;  // 🔥 Ahora es opcional
    submitLabel?: string;                     // 🔥 Ahora es opcional
    children: React.ReactNode;
}

const GenericModal: React.FC<GenericModalProps> = ({ title, isOpen, onClose, onSubmit, submitLabel, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                {/* 📌 Título del modal */}
                <h2 className="text-xl font-bold mb-4">{title}</h2>

                {/* 📌 Contenido dinámico del modal */}
                <form onSubmit={onSubmit}>
                    {children}

                    {/* 📌 Botones de acción */}
                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancelar
                        </button>

                        {/* 🔥 Solo mostrar el botón si se proporciona onSubmit y submitLabel */}
                        {onSubmit && submitLabel && (
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                {submitLabel}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GenericModal;
