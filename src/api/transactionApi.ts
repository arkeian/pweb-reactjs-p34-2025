import axiosClient from "./axiosClient";

export interface TransactionItem {
    bookId: string;
    quantity: number;
    price?: number;
    title?: string;
}

export interface Transaction {
    id: string;
    totalAmount: number;
    totalQuantity?: number;
    createdAt: string;
    user?: {
        id: string;
        username: string;
        email: string;
    };
    items: TransactionItem[];
}

interface TransactionListResponse {
    success: boolean;
    message: string;
    data: Transaction[];
    meta?: {
        page: number;
        limit: number;
        total: number;
    };
}

interface TransactionResponse {
    success: boolean;
    message: string;
    data: Transaction;
}

interface StatisticsResponse {
    success: boolean;
    message: string;
    data: {
        totalTransactions: number;
        averageAmount: number;
        mostPopularGenre: string;
        leastPopularGenre: string;
    };
}

export const transactionApi = {
    getAll: (params?: any) => axiosClient.get<TransactionListResponse>("/transactions", { params }),

    getById: (id: string) => axiosClient.get<TransactionResponse>(`/transactions/${id}`),

    create: (data: { items: TransactionItem[] }) => axiosClient.post<TransactionResponse>("/transactions", data),

    getStatistics: () => axiosClient.get<StatisticsResponse>("/transactions/statistics"),
};
