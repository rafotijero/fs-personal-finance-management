import axios from "./axiosConfig";
import { TransactionDTO } from "../types";

const BASE_URL = "/transactions";

// Obtener transacciones del usuario autenticado
export const getTransactionsByUser = async (userId: number) => {
    const response = await axios.get(`${BASE_URL}/user/${userId}`);
    return response.data.data || [];
};

// Crear una nueva transacción
export const createTransaction = async (transaction: TransactionDTO) => {
    const response = await axios.post(BASE_URL, transaction);
    return response.data.data;
};

// Actualizar una transacción existente
export const updateTransaction = async (id: number, transaction: Partial<TransactionDTO>) => {
    const response = await axios.put(`${BASE_URL}/${id}`, transaction);
    return response.data.data;
};

// Eliminar una transacción (soft delete)
export const deleteTransaction = async (id: number) => {
    await axios.delete(`${BASE_URL}/${id}`);
};
