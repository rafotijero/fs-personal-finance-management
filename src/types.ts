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