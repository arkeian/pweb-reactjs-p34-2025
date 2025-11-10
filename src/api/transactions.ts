const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function authHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    } as HeadersInit;
}

export interface TransactionItem {
    id: string;
    bookId: string;
    title?: string;
    price: number;
    quantity: number;
}

export interface Transaction {
    id: string;
    userId: string;
    totalAmount: number;
    createdAt: string;
    items: TransactionItem[];
}

export interface PaginatedTransactions {
    data: Transaction[];
    meta: {
        page: number;
        limit: number;
        prev: number | null;
        next: number | null;
        total: number;
        totalPages: number;
    };
}

export interface CreateTransactionPayload {
    userId: string;
    items: TransactionItem[];
}

export interface CreateTransactionResponse {
    success: boolean;
    message: string;
    data: Transaction;
}

export interface GetTransactionResponse {
    success: boolean;
    message: string;
    data: Transaction;
}

export interface StatisticsResponse {
    success: boolean;
    message: string;
    data: {
        totalUsers: number;
        totalBooks: number;
        totalTransactions: number;
    };
}

export async function createTransaction(payload: CreateTransactionPayload): Promise<CreateTransactionResponse> {
    const res = await fetch(`${BASE_URL}/transactions`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create transaction");
    return data as CreateTransactionResponse;
}

export async function fetchTransactions(params: Record<string, any> = {}): Promise<PaginatedTransactions> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") query.set(k, String(v));
    });

    const res = await fetch(`${BASE_URL}/transactions?${query.toString()}`, {
        headers: authHeaders(),
    });

    if (!res.ok) throw new Error("Failed to fetch transactions");
    return (await res.json()) as PaginatedTransactions;
}

export async function fetchTransactionById(id: string): Promise<GetTransactionResponse> {
    const res = await fetch(`${BASE_URL}/transactions/${id}`, {
        headers: authHeaders(),
    });

    if (!res.ok) throw new Error("Failed to fetch transaction");
    return (await res.json()) as GetTransactionResponse;
}

export async function fetchStatistics(): Promise<StatisticsResponse> {
    const res = await fetch(`${BASE_URL}/statistics`, {
        headers: authHeaders(),
    });

    if (!res.ok) throw new Error("Failed to fetch statistics");
    return (await res.json()) as StatisticsResponse;
}
