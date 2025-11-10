import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import { fetchBooks } from "../api/books";
import { createTransaction } from "../api/transactions";
import { getMe } from "../api/auth";
import type { Book } from "../api/books";

interface CartItem {
    bookId: string;
    title: string;
    quantity: number;
    price: number;
}

export default function Checkout() {
    const [books, setBooks] = useState<Book[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = showConfirm ? "hidden" : "auto";
    }, [showConfirm]);

    const loadBooks = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchBooks({ page, search });
            setBooks(res.data);
            setTotalPages(res.meta?.totalPages ?? 1);
        } catch (err: any) {
            setError(err.message || "Failed to load books");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBooks();
    }, [page, search]);

    const handleQuantityChange = (book: Book, delta: number) => {
        const { id, title, price } = book;
        setCart((prev) => {
            const existing = prev.find((item) => item.bookId === id);
            if (existing) {
                const newQty = existing.quantity + delta;
                if (newQty <= 0) return prev.filter((i) => i.bookId !== id);
                if (newQty > book.stockQuantity) return prev;
                return prev.map((i) =>
                    i.bookId === id ? { ...i, quantity: newQty } : i
                );
            } else if (delta > 0) {
                return [...prev, { bookId: id, title, quantity: 1, price }];
            }
            return prev;
        });
    };

    const getQuantity = (bookId: string) =>
        cart.find((i) => i.bookId === bookId)?.quantity || 0;

    const totalAmount = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const totalBooks = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleCheckout = async () => {
        setCheckoutLoading(true);
        setError(null);

        try {
            const me = await getMe();
            const userId = me.user.id;

            if (!userId) {
                throw new Error("Failed to identify user. Please login again.");
            }
            if (cart.length === 0) {
                throw new Error("Please select at least one book to checkout.");
            }

            const transactionItems = cart.map((cartItem) => {
                const book = books.find((b) => b.id === cartItem.bookId);
                if (!book) {
                    throw new Error(`Book with ID ${cartItem.bookId} not found.`);
                }

                return {
                    id: cartItem.bookId,
                    bookId: cartItem.bookId,
                    title: book.title,
                    price: book.price,
                    quantity: cartItem.quantity,
                };
            });

            await createTransaction({
                userId,
                items: transactionItems,
            });

            setCart([]);

            setTimeout(() => {
                navigate("/books", { state: { showToast: "checkout" } });
            }, 1500);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Checkout failed. Please try again.");
            setCheckoutLoading(false);
        }
    };

    return (
        <div
            style={{
                backgroundColor: "#f0f9ff",
                minHeight: "100vh",
                fontFamily: "Poppins, sans-serif",
                position: "relative",
            }}
        >
            <Navbar />

            <div className="container py-4" style={{ maxWidth: 800 }}>
                {/* --- KOREKSI 1 (HEADER) --- */}
                <div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-start align-items-sm-center mb-4 gap-3 gap-sm-0">
                    <h2 className="fw-bold m-0">Checkout</h2>
                    <input
                        type="text"
                        placeholder="Search books..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        // Tambahkan w-100 w-sm-auto
                        className="form-control w-100 w-sm-auto"
                        style={{
                            maxWidth: "320px", // maxWidth bisa tetap
                            border: "2px solid black",
                            boxShadow: "3px 3px 0 black",
                        }}
                    />
                </div>
                {/* --- BATAS KOREKSI 1 --- */}


                {error && !showConfirm && (
                    <p className="text-danger fw-semibold">{error}</p>
                )}

                {loading ? (
                    <Loader />
                ) : books.length === 0 ? (
                    <p>No books available for checkout.</p>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        {books.map((book) => {
                            const quantity = getQuantity(book.id);
                            const isOutOfStock = book.stockQuantity <= 0;

                            return (
                                <div
                                    key={book.id}
                                    style={{
                                        border: "3px solid black",
                                        borderRadius: "12px",
                                        padding: "1rem",
                                        backgroundColor: isOutOfStock ? "#e5e7eb" : "white",
                                        opacity: isOutOfStock ? 0.6 : 1,
                                        boxShadow: "6px 6px 0 #93c5fd",
                                    }}
                                >
                                    {/* --- KOREKSI 2 (ITEM BUKU) --- */}
                                    <div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-start align-items-sm-center gap-3">
                                        <div>
                                            <h5 className="fw-bold mb-1">{book.title}</h5>
                                            <p className="mb-0">
                                                <strong>Writer:</strong> {book.writer} <br />
                                                <strong>Price:</strong> Rp
                                                {book.price.toLocaleString("id-ID")} |{" "}
                                                <strong>Stock:</strong> {book.stockQuantity}
                                            </p>
                                            {isOutOfStock && (
                                                <p className="fw-semibold text-danger mt-3 mb-0 ">
                                                    Out of Stock
                                                </p>
                                            )}
                                        </div>

                                        {!isOutOfStock && (
                                            <div
                                                className="d-flex align-items-center gap-2"
                                                style={{ userSelect: "none" }}
                                            >
                                                <button
                                                    className="btn btn-danger fw-bold"
                                                    style={{
                                                        border: "2px solid black",
                                                        boxShadow: "2px 2px 0 black",
                                                        width: "36px",
                                                        height: "36px",
                                                    }}
                                                    onClick={() => handleQuantityChange(book, -1)}
                                                >
                                                    -
                                                </button>
                                                <div
                                                    style={{
                                                        minWidth: "40px",
                                                        textAlign: "center",
                                                        border: "2px solid black",
                                                        borderRadius: "6px",
                                                        padding: "4px 0",
                                                        backgroundColor: "white",
                                                        fontWeight: "bold",
                                                        boxShadow: "2px 2px 0 black",
                                                    }}
                                                >
                                                    {quantity}
                                                </div>
                                                <button
                                                    className="btn btn-primary fw-bold"
                                                    style={{
                                                        border: "2px solid black",
                                                        boxShadow: "2px 2px 0 black",
                                                        width: "36px",
                                                        height: "36px",
                                                    }}
                                                    onClick={() => handleQuantityChange(book, +1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {/* --- BATAS KOREKSI 2 --- */}
                                </div>
                            );
                        })}

                        <div className="d-flex justify-content-center">
                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                onChange={(p) => setPage(p)}
                            />
                        </div>

                        {/* --- KOREKSI 3 (TOTAL BAR) --- */}
                        <div
                            className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-start align-items-sm-center mt-4 gap-3"
                            style={{
                                borderTop: "3px solid black",
                                paddingTop: "1rem",
                            }}
                        >
                            <h5 className="fw-bold m-0"> {/* Tambahkan m-0 */}
                                Total: Rp{totalAmount.toLocaleString("id-ID")}
                            </h5>
                            <button
                                onClick={() => setShowConfirm(true)}
                                disabled={checkoutLoading}
                                // Tambahkan w-100 w-sm-auto
                                className="btn btn-primary fw-bold w-100 w-sm-auto"
                                style={{
                                    border: "2px solid black",
                                    boxShadow: "3px 3px 0 black",
                                    backgroundColor: "#0d6efd",
                                }}
                            >
                                Checkout
                            </button>
                        </div>
                        {/* --- BATAS KOREKSI 3 --- */}
                    </div>
                )}
            </div>

            {showConfirm && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            border: "3px solid black",
                            boxShadow: "8px 8px 0 #93c5fd",
                            padding: "2rem",
                            borderRadius: "12px",
                            textAlign: "center",
                            // --- KOREKSI 4 (MODAL WIDTH) ---
                            width: "90%", // Ganti dari width: "480px"
                            maxWidth: "480px", // Tambahkan maxWidth
                            // --- BATAS KOREKSI 4 ---
                        }}
                    >
                        {checkoutLoading ? (
                            <>
                                <Loader />
                                <p className="fw-semibold mt-3">Processing your checkout...</p>
                            </>
                        ) : (
                            <>
                                <h5 className="fw-bold mb-3">Confirm Checkout</h5>
                                <p className="mb-2">
                                    You're about to buy <strong>{totalBooks}</strong> book
                                    {totalBooks > 1 && "s"}.
                                </p>
                                <p className="fw-semibold mb-4">
                                    Total amount:{" "}
                                    <span className="text-primary">
                                        Rp{totalAmount.toLocaleString("id-ID")}
                                    </span>
                                </p>

                                {error && (
                                    <p
                                        className="text-danger fw-semibold mb-3"
                                        style={{
                                            border: "2px solid red",
                                            borderRadius: "6px",
                                            padding: "8px",
                                            backgroundColor: "#fee2e2",
                                        }}
                                    >
                                        {error}
                                    </p>
                                )}

                                {/* --- KOREKSI 5 (TOMBOL MODAL) --- */}
                                <div className="d-grid gap-2 d-sm-flex justify-content-sm-center gap-sm-3 mt-4">
                                    <button
                                        onClick={() => {
                                            setError(null);
                                            setShowConfirm(false);
                                        }}
                                        className="btn btn-danger fw-bold"
                                        style={{
                                            border: "2px solid black",
                                            boxShadow: "2px 2px 0 black",
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCheckout}
                                        className="btn btn-primary fw-bold"
                                        style={{
                                            border: "2px solid black",
                                            boxShadow: "2px 2px 0 black",
                                            backgroundColor: "#0d6efd",
                                        }}
                                    >
                                        Confirm
                                    </button>
                                </div>
                                {/* --- BATAS KOREKSI 5 --- */}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}