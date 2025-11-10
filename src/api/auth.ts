const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface LoginResponse {
    message: string;
    token: string;
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    data: User;
}

// Register
export async function register(body: RegisterRequest): Promise<RegisterResponse> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Register failed");
    }

    return data as RegisterResponse;
}

// Login
export async function login(body: LoginRequest): Promise<LoginResponse> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Login failed");
    }

    if (!data.token) {
        throw new Error("Something went wrong...");
    }

    localStorage.setItem("token", data.token);
    return data as LoginResponse;
}

export function getToken(): string | null {
    return localStorage.getItem("token");
}

export function logout(): void {
    localStorage.removeItem("token");
}

export async function getMe(): Promise<{ user: User }> {
    const token = getToken();
    if (!token) {
        throw new Error("Not authenticated");
    }

    const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message || "Session expired. Please login again.");
    }

    if (!json.user?.id) {
        throw new Error("Invalid user data received.");
    }

    return json as { user: User };
}
