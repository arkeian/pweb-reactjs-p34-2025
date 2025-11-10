import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import Toast from "../components/Toast";
import Pagination from "../components/Pagination";
import { fetchTransactions } from "../api/transactions";
import type { Transaction } from "../api/transactions";
import { getMe } from "../api/auth";

export default function TransactionsList() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");
    const [sortField, setSortField] = useState<"amount" | "price" | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [showSortMenu, setShowSortMenu] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    // Fetch transactions from backend
    useEffect(() => {
        const fetchUserTransactions = async () => {
            setLoading(true);
            setError(null);
            try {
                const me = await getMe();
                const userId = me.user.id;

                const params: Record<string, any> = {
                    userId,
                    search,
                    page,
                };

                const res = await fetchTransactions(params);

                // 🔹 Client-side sorting
                let sortedData = [...res.data];
                if (sortField === "amount") {
                    sortedData.sort((a, b) => {
                        const totalA = a.items.reduce(
                            (sum: number, item: any) => sum + item.quantity,
                            0
                        );
                        const totalB = b.items.reduce(
                            (sum: number, item: any) => sum + item.quantity,
                            0
                        );
                        return sortOrder === "asc"
                            ? totalA - totalB
                            : totalB - totalA;
                    });
                } else if (sortField === "price") {
                    sortedData.sort((a, b) =>
                        sortOrder === "asc"
                            ? a.totalAmount - b.totalAmount
                            : b.totalAmount - a.totalAmount
                    );
                }

                setTransactions(sortedData);
                setTotalPages(res.meta.totalPages);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserTransactions();
    }, [search, sortField, sortOrder, page]);

    const handleViewDetails = (id: string) => navigate(`/transactions/${id}`);

    const toggleSortMenu = () => setShowSortMenu((prev) => !prev);

    const handleSortSelect = (field: "amount" | "price") => {
        if (sortField === field) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortOrder("desc");
        }
        setShowSortMenu(false);
    };

    const handleClearSort = () => {
        setSortField(null);
        setSortOrder("desc");
        setShowSortMenu(false);
    };

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
                {/* --- KOREKSI 1 (HEADER) --- */}
                <div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-start align-items-sm-center mb-4 gap-3">
                    <h2 className="fw-bold m-0">Transaction History</h2>

                    {/* --- KOREKSI 2 (SEARCH/SORT GROUP) --- */}
                    <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-sm-auto">
                        <input
                            type="text"
                            placeholder="Search by ID"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="form-control" // w-100 w-sm-auto dihapus
                            style={{
                                border: "2px solid black",
                                boxShadow: "3px 3px 0 black",
                                // maxWidth: "200px", // Dihapus
                            }}
                        />

                        {/* --- KOREKSI 3 (SORT WRAPPER) --- */}
                        <div style={{ position: "relative" }} className="w-100 w-sm-auto">
                            <button
                                className="btn btn-primary fw-bold w-100" // Tambah w-100
                                style={{
                                    border: "2px solid black",
                                    boxShadow: "3px 3px 0 black",
                                    backgroundColor: "#0d6efd",
                                }}
                                onClick={toggleSortMenu}
                            >
                                {sortField
                                    ? `Sort (${sortField} ${sortOrder})`
                                    : "Sort"}
                            </button>

                            {showSortMenu && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "110%",
                                        left: 0,
                                        background: "white",
                                        border: "2px solid black",
                                        boxShadow: "4px 4px 0 black",
                                        borderRadius: "8px",
                                        zIndex: 10,
                                        // --- KOREKSI 4 (SORT MENU) ---
                                        width: "100%", // Ganti dari 200px
                                    }}
                                >
                                    {["Amount", "Price"].map((field) => (
                                        <div
                                            key={field}
                                            onClick={() =>
                                                handleSortSelect(field.toLowerCase() as "amount" | "price")
                                            }
                                            style={{
                                                padding: "10px 12px",
                                                cursor: "pointer",
                                                backgroundColor:
                                                    sortField === field.toLowerCase()
                                                        ? "#e0f2fe"
                                                        : "white",
                                                fontWeight:
                                                    sortField === field.toLowerCase()
                                                        ? "600"
                                                        : "normal",
                                                borderBottom: "2px solid #000",
                                            }}
                                        >
                                            Sort by {field}{" "}
                                            {sortField === field.toLowerCase()
                                                ? `(${sortOrder === "asc" ? "↑" : "↓"})`
                                                : ""}
                                        </div>
                                    ))}

                                    <div
                                        onClick={handleClearSort}
                                        style={{
                                            padding: "10px 12px",
                                            cursor: "pointer",
                                            backgroundColor: "#fee2e2",
                                            color: "#b91c1c",
                                            fontWeight: "600",
                                            borderTop: "2px solid #000",
                                        }}
                                    >
                                        Clear Sort
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {loading && <Loader />}

                {error && !loading && (
                    <div className="mb-3">
                        <p className="text-danger fw-semibold">{error}</p>
                    </div>
                )}

                {!loading && transactions.length === 0 && !error && (
                    <div className="mb-3">
                        <p className="text-muted fw-semibold">No transactions found.</p>
                    </div>
                )}

                <div className="d-flex flex-column gap-3">
                    {transactions.map((transaction) => {
                        const totalBooks = transaction.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                        );

                        return (
                            <div
                                key={transaction.id}
                                style={{
                                    border: "3px solid black",
                                    borderRadius: "12px",
                                    padding: "1rem",
                                    backgroundColor: "white",
                                    boxShadow: "6px 6px 0 #93c5fd",
                                }}
                            >
                                {/* --- KOREKSI 5 (KARTU) --- */}
                                <div className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-start align-items-sm-center gap-3">
                                    <div>
                                        {/* --- KOREKSI 6 (ID) --- */}
                                        <h5 className="fw-bold mb-1 text-break">
                                            Transaction ID: {transaction.id}
                                        </h5>
                                        <p className="mb-0">
                                            <strong>Books Purchased:</strong>{" "}
                                            {totalBooks} pcs <br />
                                            <strong>Total Price:</strong> Rp{" "}
                                            {transaction.totalAmount.toLocaleString("id-ID")} <br />
                                            <strong>Date:</strong>{" "}
                                            {new Date(transaction.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                    {/* --- KOREKSI 7 (TOMBOL) --- */}
                                    <button
                                        onClick={() => handleViewDetails(transaction.id)}
                                        className="fw-bold btn btn-primary w-100 w-sm-auto" // Tambah w-100 w-sm-auto
                                        style={{
                                            border: "2px solid black",
                                            boxShadow: "3px 3px 0 black",
                                            backgroundColor: "#0d6efd",
                                        }}
                                    >
                                        Details
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-4 d-flex justify-content-center">
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onChange={(p) => setPage(p)}
                    />
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