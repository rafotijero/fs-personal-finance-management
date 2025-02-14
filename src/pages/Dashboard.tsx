import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import axios from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { BankAccount, TransactionDTO} from "../types.ts";

interface IncomeExpenseData {
    name: string;
    value: number;
}

const Dashboard: React.FC = () => {
    const { token } = useAuth();
    const [totalBalance, setTotalBalance] = useState<number>(0);
    const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
    const [incomeExpenseData, setIncomeExpenseData] = useState<IncomeExpenseData[]>([]);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

    useEffect(() => {
        if (token) {
            fetchDashboardData();
        }
    }, [token]);

    const fetchDashboardData = async () => {
        try {
            // 🔑 Obtener el ID del usuario desde el token
            const storedToken = localStorage.getItem("token");
            if (!storedToken) {
                console.error("❌ No hay token disponible");
                return;
            }
            const decodedToken: any = jwtDecode(storedToken);
            const userId = decodedToken?.id || decodedToken?.userId;

            if (!userId) {
                console.error("❌ No se pudo obtener el ID del usuario del token.");
                return;
            }

            // Obtener cuentas bancarias y calcular saldo total
            const accountsResponse = await axios.get(`/bank-accounts/owner/${userId}`);
            const accounts: BankAccount[] = accountsResponse.data.data || [];
            setBankAccounts(accounts);
            setTotalBalance(accounts.reduce((acc: number, account: BankAccount) => acc + account.balance, 0));

            // Obtener transacciones
            const transactionsResponse = await axios.get(`/transactions/user/${userId}/recent?limit=5`);
            const transactionsData: TransactionDTO[] = transactionsResponse.data.data || [];
            setTransactions(transactionsData);

            // Calcular ingresos vs egresos
            const income = transactionsData
                .filter((tx: TransactionDTO) => tx.transactionType === "INCOME")
                .reduce((sum: number, tx: TransactionDTO) => sum + tx.amount, 0);

            const expense = transactionsData
                .filter((tx: TransactionDTO) => tx.transactionType === "EXPENSE")
                .reduce((sum: number, tx: TransactionDTO) => sum + tx.amount, 0);

            setIncomeExpenseData([
                { name: "Ingresos", value: income },
                { name: "Egresos", value: expense },
            ]);
        } catch (error) {
            console.error("❌ Error al cargar datos del dashboard:", error);
        }
    };

    const COLORS = [
        "#22c55e", // Verde
        "#ef4444", // Rojo
        "#3b82f6", // Azul
        "#f59e0b", // Naranja
        "#a855f7", // Púrpura
        "#14b8a6", // Turquesa
        "#eab308", // Amarillo
        "#ec4899", // Rosa
        "#6366f1", // Azul índigo
        "#7c3aed"  // Violeta oscuro
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard Financiero</h1>

            {/* Saldo total */}
            <div className="bg-blue-600 text-white p-4 rounded-lg text-center mb-6">
                <h2 className="text-xl font-semibold">Saldo Total Disponible</h2>
                <p className="text-3xl font-bold">${totalBalance.toFixed(2)}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gráfico de Ingresos vs Egresos */}
                <div className="bg-white p-4 shadow-md rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Ingresos vs Egresos</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={incomeExpenseData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#4F46E5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Distribución de saldos */}
                <div className="bg-white p-4 shadow-md rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Saldos por Cuenta Bancaria</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={bankAccounts.map(acc => ({
                                    name: acc.accountDescription, // ✅ Ahora usa el nombre del banco
                                    balance: acc.balance
                                }))}
                                dataKey="balance"
                                nameKey="name"
                                outerRadius={80}
                                label
                            >
                                {bankAccounts.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Últimas transacciones */}
            <div className="bg-white p-4 shadow-md rounded-lg mt-6">
                <h2 className="text-lg font-semibold mb-4">Últimas Transacciones</h2>
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr>
                        <th className="border-b p-2">Fecha</th>
                        <th className="border-b p-2">Descripción</th>
                        <th className="border-b p-2">Monto</th>
                        <th className="border-b p-2">Recibo</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactions.map((tx) => (
                        <tr key={tx.id}>
                            <td className="border-b p-2">{new Date(tx.transactionDate).toLocaleDateString()}</td>
                            <td className="border-b p-2">{tx.description}</td>
                            <td className={`border-b p-2 ${tx.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                                ${Math.abs(tx.amount).toFixed(2)}
                            </td>
                            <td className="border-b p-2">
                                {tx.receiptFilePath ? (
                                    <a href={`${import.meta.env.VITE_API_URL}${tx.receiptFilePath}`}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="text-blue-600 hover:underline">
                                        📄 Ver
                                    </a>
                                ) : "-"}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default Dashboard;
