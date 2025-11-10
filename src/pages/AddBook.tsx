import { useEffect, useState } from "react";
import { addBook, fetchGenres } from "../api/books";
import type { Genre, AddBookPayload } from "../api/books";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import Loader from "../components/Loader";

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
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchGenres()
            .then(setGenres)
            .catch(err => setError(err.message));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!title.trim() || !writer.trim() || !publisher.trim() || !genreId) {
            return setError("Title, Writer, Publisher, and Genre are required.");
        }

        const currentYear = new Date().getFullYear();
        if (publicationYear > currentYear) {
            return setError(`Publication year cannot exceed ${currentYear}.`);
        }
        if (price <= 0) {
            return setError("Price must be greater than 0.");
        }
        if (stockQuantity < 0) {
            return setError("Stock cannot be negative.");
        }

        setLoading(true);

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

            setTitle("");
            setWriter("");
            setPublisher("");
            setDescription("");
            setPrice(0);
            setStockQuantity(0);

            navigate("/books", { state: { showToast: "addBook" } });
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: "#f0f9ff", minHeight: "100vh", fontFamily: "Poppins, sans-serif" }}>
            <Navbar />

            <div className="container py-4" style={{ maxWidth: 700 }}>
                <div
                    style={{
                        border: "3px solid black",
                        borderRadius: "12px",
                        padding: "2rem", // Padding ini mungkin agak besar di HP, bisa diganti ke "p-3 p-md-4"
                        backgroundColor: "white",
                        boxShadow: "6px 6px 0 #93c5fd",
                    }}
                >
                    <h2 className="fw-bold mb-4">Add New Book</h2>

                    {error && <p className="text-danger fw-semibold">{error}</p>}

                    {loading ? (
                        <Loader />
                    ) : (
                        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                            <div>
                                <label className="fw-semibold mb-1">Title</label>
                                <input
                                    className="form-control"
                                    placeholder="Enter book title"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    style={{ border: "2px solid black", boxShadow: "3px 3px 0 black" }}
                                />
                            </div>

                            <div>
                                <label className="fw-semibold mb-1">Writer</label>
                                <input
                                    className="form-control"
                                    placeholder="Enter writer name"
                                    value={writer}
                                    onChange={e => setWriter(e.target.value)}
                                    style={{ border: "2px solid black", boxShadow: "3px 3px 0 black" }}
                                />
                            </div>

                            <div>
                                <label className="fw-semibold mb-1">Publisher</label>
                                <input
                                    className="form-control"
                                    placeholder="Enter publisher name"
                                    value={publisher}
                                    onChange={e => setPublisher(e.target.value)}
                                    style={{ border: "2px solid black", boxShadow: "3px 3px 0 black" }}
                                />
                            </div>

                            <div>
                                <label className="fw-semibold mb-1">Description</label>
                                <textarea
                                    className="form-control"
                                    placeholder="Short description (optional)"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    rows={3}
                                    style={{ border: "2px solid black", boxShadow: "3px 3px 0 black" }}
                                />
                            </div>

                            {/* --- KOREKSI 1 DISINI --- */}
                            <div className="d-flex flex-column flex-sm-row gap-3">
                                <div className="flex-fill">
                                    <label className="fw-semibold mb-1">Publication Year</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={publicationYear}
                                        onChange={e => setPublicationYear(+e.target.value)}
                                        style={{ border: "2px solid black", boxShadow: "3px 3px 0 black" }}
                                    />
                                </div>
                                <div className="flex-fill">
                                    <label className="fw-semibold mb-1">Price</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={price}
                                        onChange={e => setPrice(+e.target.value)}
                                        style={{ border: "2px solid black", boxShadow: "3px 3px 0 black" }}
                                    />
                                </div>
                            </div>
                            {/* --- BATAS KOREKSI 1 --- */}


                            {/* --- KOREKSI 2 DISINI --- */}
                            <div className="d-flex flex-column flex-sm-row gap-3">
                                <div className="flex-fill">
                                    <label className="fw-semibold mb-1">Stock Quantity</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={stockQuantity}
                                        onChange={e => setStockQuantity(+e.target.value)}
                                        style={{ border: "2px solid black", boxShadow: "3px 3px 0 black" }}
                                    />
                                </div>
                                <div className="flex-fill">
                                    <label className="fw-semibold mb-1">Genre</label>
                                    <select
                                        className="form-select"
                                        value={genreId}
                                        onChange={e => setGenreId(e.target.value)}
                                        style={{ border: "2px solid black", boxShadow: "3px 3px 0 black" }}
                                    >
                                        <option value="">-- Select Genre --</option>
                                        {genres.map(g => (
                                            <option key={g.id} value={g.id}>
                                                {g.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {/* --- BATAS KOREKSI 2 --- */}


                            {/* --- KOREKSI 3 DISINI --- */}
                            <div className="d-grid gap-2 d-sm-flex justify-content-sm-end mt-4 gap-sm-3">
                                <button
                                    type="button"
                                    onClick={() => navigate("/books")}
                                    className="btn btn-light fw-bold"
                                    style={{ border: "2px solid black", boxShadow: "3px 3px 0 black" }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary fw-bold"
                                    style={{ border: "2px solid black", boxShadow: "3px 3px 0 black" }}
                                >
                                    {loading ? "Adding..." : "Add Book"}
                                </button>
                            </div>
                            {/* --- BATAS KOREKSI 3 --- */}
                            
                        </form>
                    )}
                </div>
            </div>

            {toastMessage && (
                <Toast
                    message={toastMessage}
                    type="success"
                    onClose={() => setToastMessage(null)}
                />
            )}
        </div>
    );
}