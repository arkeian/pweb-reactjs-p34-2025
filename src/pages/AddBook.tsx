import { useEffect, useState } from "react";
import { addBook, fetchGenres} from "../api/books";
import type { Genre } from "../api/books";
import type { AddBookPayload } from "../api/books";
import { useNavigate } from "react-router-dom";

export default function AddBook() {
  const [title, setTitle] = useState("");
  const [writer, setWriter] = useState("");
  const [publisher, setPublisher] = useState("");
  const [description, setDescription] = useState("");
  const [publicationYear, setPublicationYear] = useState<number>(new Date().getFullYear());
  const [price, setPrice] = useState<number>(0);
  const [stockQuantity, setStockQuantity] = useState<number>(0);
  const [genreId, setGenreId] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchGenres()
      .then(setGenres)
      .catch(err => setError(err.message));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !writer || !publisher || !genreId) {
      return setError("Title, Writer, Publisher, dan Genre wajib diisi");
    }

    setLoading(true);
    setError(null);

    const payload: AddBookPayload = {
      title,
      writer,
      publisher,
      description,
      publicationYear,
      price,
      stockQuantity,
      genreId,
    };

    try {
      await addBook(payload);
      navigate("/books"); // kembali ke list buku
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Add Book</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Writer" value={writer} onChange={e => setWriter(e.target.value)} />
        <input placeholder="Publisher" value={publisher} onChange={e => setPublisher(e.target.value)} />
        <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <input type="number" placeholder="Publication Year" value={publicationYear} onChange={e => setPublicationYear(+e.target.value)} />
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(+e.target.value)} />
        <input type="number" placeholder="Stock Quantity" value={stockQuantity} onChange={e => setStockQuantity(+e.target.value)} />
        <select value={genreId} onChange={e => setGenreId(e.target.value)}>
          <option value="">-- Select Genre --</option>
          {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Book"}</button>
      </form>
    </div>
  );
}
