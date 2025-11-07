import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Book } from "../api/books";
import { fetchBookById } from "../api/books";

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchBookById(id)
      .then(res => setBook(res.data))
      .catch(err => setError(String(err.message)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading book detail...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!book) return <p>Book not found</p>;

  return (
    <div style={{ padding: 16 }}>
      <button onClick={() => navigate(-1)}>Back</button>
      <h2>{book.title}</h2>
      <p><strong>Writer:</strong> {book.writer}</p>
      <p><strong>Publisher:</strong> {book.publisher}</p>
      <p><strong>Genre:</strong> {book.genre}</p>
      <p><strong>Price:</strong> ${book.price}</p>
      <p><strong>Stock:</strong> {book.stockQuantity}</p>
      <p><strong>Publication Year:</strong> {book.publicationYear}</p>
      <p><strong>Description:</strong> {book.description}</p>
    </div>
  );
}
