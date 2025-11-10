import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import Toast from "../components/Toast";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";
import type { Book } from "../api/books";
import { fetchBooks, deleteBook } from "../api/books";

export default function BooksList() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // --- STATE BARU UNTUK MODAL KONFIRMASI ---
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
    // ------------------------------------------

    const navigate = useNavigate();
    const location = useLocation();

    const loadBooks = useCallback(async (p = page) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchBooks({ page: p });
            setBooks(res.data);
            setTotalPages(res.meta?.totalPages ?? Math.max(1, Math.ceil((res.meta?.total ?? 0) / (res.meta?.limit ?? 10))));
        } catch (err: any) {
            setError(err?.message ?? "Failed to fetch books");
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        if (location.state?.showToast) {
            const toastType = location.state.showToast;
            if (toastType === "checkout") {
                setToastMessage("Checkout successful!");
            }
            else if (toastType === "addBook") {
                setToastMessage("Book added successfully!");
            }

            try {
                window.history.replaceState({}, document.title);
            } catch { }
        }
    }, [location]);

    useEffect(() => {
        loadBooks(page);
    }, [page, loadBooks]);

    // --- FUNGSI DIUBAH DAN DITAMBAHKAN ---

    // 1. Fungsi ini dipanggil oleh BookCard, hanya untuk membuka modal
    const handleOpenDeleteConfirm = (book: Book) => {
        setBookToDelete(book);
        setShowConfirmModal(true);
    };

    // 2. Fungsi ini untuk menutup modal (jika batal)
    const handleCancelDelete = () => {
        setShowConfirmModal(false);
        setBookToDelete(null);
    };

    // 3. Fungsi ini (logika lama) dipanggil oleh modal
    const handleConfirmDelete = async () => {
        if (!bookToDelete) return; // Pastikan ada buku yang dipilih

        setError(null);
        
        // Ambil ID lalu tutup modal SEBELUM proses delete
        const bookToDel = bookToDelete;
        setShowConfirmModal(false);
        setBookToDelete(null);

        try {
            setLoading(true);
            await deleteBook(bookToDel.id);
            setToastMessage("Book deleted successfully!");
            await loadBooks(page); // Muat ulang buku
        } catch (err: any) {
            setError(err?.message ?? "Failed to delete book");
        } finally {
            setLoading(false);
        }
    };
    // ------------------------------------------

    return (
        <div
            style={{
                backgroundColor: "#f0f9ff",
                minHeight: "100vh",
                fontFamily: "Poppins, sans-serif",
            }}
        >
            <Navbar />

            <div className="container py-4">
                
                {/* --- KOREKSI DI SINI --- */}
                <div 
                  className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-start align-items-sm-center mb-4 gap-3 gap-sm-0"
                >
                    <h2 className="fw-bold m-0">Books List</h2>

                    <div style={{ display: "flex", gap: 8 }}>
                        <button
                            onClick={() => navigate("/books/add")}
                            className="btn btn-primary fw-bold"
                            style={{ border: "2px solid black", boxShadow: "3px 3px 0 black" }}
                        >
                            Add Book
                        </button>
                    </div>
                </div>
                {/* --- BATAS KOREKSI --- */}


                {loading && <Loader />}

                {error && !loading && (
                    <div className="mb-3">
                        <p className="text-danger fw-semibold">{error}</p>
                    </div>
                )}

                {!loading && books.length === 0 && !error && (
                    <div className="mb-3">
                        <p className="text-muted fw-semibold">No books found.</p>
                    </div>
                )}

                <div className="d-flex flex-column">
                    {books.map((b) => (
                        <BookCard
                            key={b.id}
                            book={b}
                            onDetail={() => navigate(`/books/${b.id}`)}
                            // Panggil fungsi untuk membuka modal
                            onDelete={() => handleOpenDeleteConfirm(b)}
                        />
                    ))}
                </div>

                <div className="d-flex justify-content-center">
                    <Pagination page={page} totalPages={totalPages} onChange={(p) => setPage(p)} />
                </div>
            </div>

            {toastMessage && (
                <Toast message={toastMessage} type="success" onClose={() => setToastMessage(null)} />
            )}

            {/* --- JSX UNTUK MODAL KONFIRMASI --- */}
            {showConfirmModal && bookToDelete && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1050 // Pastikan di atas konten lain
                    }}
                >
                    <div
                        className="bg-white p-4 rounded"
                        style={{
                            border: "4px solid black",
                            boxShadow: "6px 6px 0 black",
                            width: '90%',
                            maxWidth: '400px'
                        }}
                    >
                        <h4 className="fw-bold text-primary">Confirm Deletion</h4>
                        <p className="mt-3">
                            Are you sure you want to delete "<strong>{bookToDelete.title}</strong>"?
                            This action cannot be undone.
                        </p>
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <button
                                className="btn btn-secondary fw-bold"
                                onClick={handleCancelDelete} // Tutup modal
                                style={{ border: "2px solid black", boxShadow: "3px 3px 0 black" }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger fw-bold text-white"
                                onClick={handleConfirmDelete} // Jalankan delete
                                style={{ border: "2px solid black", boxShadow: "3px 3px 0 black" }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* ------------------------------------- */}
        </div>
    );
}