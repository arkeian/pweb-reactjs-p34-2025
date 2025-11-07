import { useEffect, useState } from "react";
import type { Book } from "../api/books";
import { fetchBooks, deleteBook } from "../api/books";
import { useNavigate } from "react-router-dom";

export default function BooksList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const loadBooks = () => {
    setLoading(true);
    setError(null);
    fetchBooks({ page })
      .then(res => {
        setBooks(res.data);
        setTotalPages(res.meta.totalPages);
      })
      .catch(err => setError(String(err.message)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBooks();
  }, [page]);

  const handleDelete = async (book: Book) => {
    if (!confirm(`Are you sure you want to delete "${book.title}"?`)) return;
    try {
      await deleteBook(book.id);
      alert("Book deleted successfully");
      loadBooks(); // refresh list
    } catch (err: any) {
      alert("Failed to delete book: " + err.message);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Books List</h2>

      <button onClick={() => navigate("/books/add")} style={{ marginBottom: 16 }}>
        Add Book
      </button>

      {loading && <p>Loading books...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && books.length === 0 && <p>No books found.</p>}

      <ul>
        {books.map(b => (
          <li key={b.id} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
            <strong>{b.title}</strong> — {b.writer} — ${b.price} — stock: {b.stockQuantity} — genre: {b.genre}
            <div style={{ marginTop: 4 }}>
              <button onClick={() => navigate(`/books/${b.id}`)} style={{ marginRight: 8 }}>
                Detail
              </button>
              <button onClick={() => handleDelete(b)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 12 }}>
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ marginRight: 8 }}>
          Prev
        </button>
        <span> Page {page} / {totalPages} </span>
        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{ marginLeft: 8 }}>
          Next
        </button>
      </div>
    </div>
  );
}
