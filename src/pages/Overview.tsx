import React from "react";

const Overview: React.FC = () => {
    // Ejemplo de datos simulados
    const totalIncome = 5000;
    const totalExpense = 3000;
    const balance = totalIncome - totalExpense;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Resumen General</h2>
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-100 p-4 rounded shadow">
                    <h3 className="text-lg font-bold">Ingresos</h3>
                    <p className="text-2xl text-green-600 font-bold">
                        ${totalIncome.toFixed(2)}
                    </p>
                </div>
                <div className="bg-red-100 p-4 rounded shadow">
                    <h3 className="text-lg font-bold">Egresos</h3>
                    <p className="text-2xl text-red-600 font-bold">
                        ${totalExpense.toFixed(2)}
                    </p>
                </div>
                <div className="bg-blue-100 p-4 rounded shadow">
                    <h3 className="text-lg font-bold">Balance</h3>
                    <p className="text-2xl text-blue-600 font-bold">
                        ${balance.toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Overview;
