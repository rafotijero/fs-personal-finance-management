export interface Bank {
    id: number;
    name: string;
    initials: string;
    country: string;
    logo?: string;
}

export interface BankAccount {
    id: number;
    accountNumber: string;
    balance: number;
    accountType: "SAVINGS" | "CHECKING";
    bank: {
        id: number;
        name: string;
    };
    owner: {
        id: number;
        name: string;
    };
    isDeleted: "0" | "1"; // "0" = Activo, "1" = Eliminado
}

export interface TransactionDTO {
    id: number;
    bankAccountId: number;
    transactionType: "INCOME" | "EXPENSE";
    amount: number;
    transactionDate: string; // Se recibe como string en ISO format
    description?: string;
    receiptFilePath?: string; // Para manejar archivos adjuntos
    isDeleted: "0" | "1"; // "0" = Activo, "1" = Eliminado
}
