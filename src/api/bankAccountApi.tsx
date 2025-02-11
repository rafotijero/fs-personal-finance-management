import axios from "./axiosConfig";
import { BankAccount } from "../types";

const BASE_URL = "/bank-accounts"; // 📌 Prefijo para las rutas de cuentas bancarias

// 🔄 Obtener todas las cuentas bancarias activas
export const fetchBankAccounts = async (): Promise<BankAccount[]> => {
    try {
        const response = await axios.get(`${BASE_URL}`);
        return response.data.data || [];
    } catch (error) {
        console.error("❌ Error al obtener las cuentas bancarias:", error);
        throw error;
    }
};

// 🔎 Obtener una cuenta bancaria por ID
export const fetchBankAccountById = async (id: number): Promise<BankAccount> => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data.data;
    } catch (error) {
        console.error(`❌ Error al obtener la cuenta bancaria con ID ${id}:`, error);
        throw error;
    }
};

// ➕ Crear una nueva cuenta bancaria
export const createBankAccount = async (data: {
    accountNumber: string;
    balance: number;
    accountType: "SAVINGS" | "CHECKING";
    bankId: number;
    ownerId: number;
}): Promise<BankAccount> => {
    try {
        const response = await axios.post(BASE_URL, data);
        return response.data.data;
    } catch (error) {
        console.error("❌ Error al crear la cuenta bancaria:", error);
        throw error;
    }
};

// ✏️ Actualizar una cuenta bancaria
export const updateBankAccount = async (id: number, data: {
    accountNumber: string;
    balance: number;
    accountType: "SAVINGS" | "CHECKING";
    bankId: number;
    ownerId: number;
}): Promise<BankAccount> => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, data);
        return response.data.data;
    } catch (error) {
        console.error(`❌ Error al actualizar la cuenta bancaria con ID ${id}:`, error);
        throw error;
    }
};

// 🗑️ Eliminar una cuenta bancaria (soft delete)
export const deleteBankAccount = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${BASE_URL}/${id}`);
    } catch (error) {
        console.error(`❌ Error al eliminar la cuenta bancaria con ID ${id}:`, error);
        throw error;
    }
};

// ♻️ Restaurar una cuenta bancaria eliminada
export const restoreBankAccount = async (id: number): Promise<void> => {
    try {
        await axios.put(`${BASE_URL}/${id}/restore`);
    } catch (error) {
        console.error(`❌ Error al restaurar la cuenta bancaria con ID ${id}:`, error);
        throw error;
    }
};
