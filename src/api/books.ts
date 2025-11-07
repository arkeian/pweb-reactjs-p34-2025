const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export interface Book {
  id: string;
  title: string;
  writer: string;
  publisher: string;
  description: string;
  publicationYear: number;
  price: number;
  stockQuantity: number;
  genre: string;
}

export interface PaginatedBooks {
  data: Book[];
  meta: {
    page: number;
    limit: number;
    prev: number | null;
    next: number | null;
    total: number;
    totalPages: number;
  };
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  } as HeadersInit; // <-- cast ke HeadersInit
}

// Get list of books
export async function fetchBooks(params: Record<string, any> = {}): Promise<PaginatedBooks> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") query.set(k, String(v));
  });

  const res = await fetch(`${BASE_URL}/books?${query.toString()}`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch books");
  return (await res.json()) as PaginatedBooks;
}

// Get single book
export async function fetchBookById(id: string): Promise<{ data: Book }> {
  const res = await fetch(`${BASE_URL}/books/${id}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch book");
  return (await res.json()) as { data: Book };
}

// Add book
export interface AddBookPayload {
  title: string;
  writer: string;
  publisher: string;
  description?: string;
  publicationYear: number;
  price: number;
  stockQuantity: number;
  genreId: string;
}

export interface AddBookResponse {
  success: boolean;
  message: string;
  data: { id: string; title: string; createdAt: string };
}

export async function addBook(payload: AddBookPayload): Promise<AddBookResponse> {
  const res = await fetch(`${BASE_URL}/books`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to add book");
  return (await res.json()) as AddBookResponse;
}

// Delete book
export interface DeleteBookResponse {
  success: boolean;
  message: string;
}

export async function deleteBook(id: string): Promise<DeleteBookResponse> {
  const res = await fetch(`${BASE_URL}/books/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete book");
  return (await res.json()) as DeleteBookResponse;
}

// Fetch genres for dropdown
export interface Genre {
  id: string;
  name: string;
}

export async function fetchGenres(): Promise<Genre[]> {
  const res = await fetch(`${BASE_URL}/genre`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch genres");

  const json = await res.json() as { success: boolean; message: string; data: Genre[]; meta: any };
  return json.data;
}