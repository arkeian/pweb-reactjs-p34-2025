const BASE_URL = import.meta.env.VITE_API_URL;

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: User;
}

// Register
export async function register(username: string, email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  return res.json() as Promise<AuthResponse>;
}

// Login
export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json() as Promise<AuthResponse>;
}

// Get logged-in user
export async function getMe(token: string) {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json() as Promise<{ user: User }>;
}
