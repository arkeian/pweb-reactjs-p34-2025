import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { fetchTransactionById } from "../api/transactions";

export default function TransactionsDetail() {
    const { id } = useParams<{ id: string }>();
    const [transaction, setTransaction] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setError(null);

        fetchTransactionById(id)
            .then((res) => setTransaction(res.data))
            .catch((err) => setError(String(err.message)))
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <div
            style={{
                backgroundColor: "#f0f9ff",
                minHeight: "100vh",
                fontFamily: "Poppins, sans-serif",
            }}
        >
            <Navbar />

            <div className="container py-4" style={{ maxWidth: 700 }}>
                {loading ? (
                    <Loader />
                ) : error ? (
                    <div
                        className="p-4 text-center"
                        style={{
                            border: "3px solid black",
                            borderRadius: "12px",
                            backgroundColor: "white",
                            boxShadow: "6px 6px 0 #93c5fd",
                        }}
                    >
                        <p className="text-danger fw-semibold mb-3">{error}</p>
                        {/* --- KOREKSI 1.A --- */}
                        <div className="d-grid d-sm-flex justify-content-sm-end mt-3">
                            <button
                                className="btn btn-primary fw-bold" // w-100 dihapus, d-grid yg atur
                                onClick={() => navigate(-1)}
                                style={{
                                    border: "2px solid black",
                                    boxShadow: "3px 3px 0 black",
                                    backgroundColor: "#0d6efd",
                                }}
                            >
                                Back
                            </button>
                        </div>
                        {/* --- BATAS KOREKSI --- */}
                    </div>
                ) : !transaction ? (
                    <div
                        className="p-4 text-center"
                        style={{
                            border: "3px solid black",
                            borderRadius: "12px",
                            backgroundColor: "white",
                            boxShadow: "6px 6px 0 #93c5fd",
                        }}
                    >
                        <p className="fw-semibold mb-3">Transaction not found.</p>
                        {/* --- KOREKSI 1.B --- */}
                        <div className="d-grid d-sm-flex justify-content-sm-end mt-3">
                            <button
                                className="btn btn-primary fw-bold"
                                onClick={() => navigate(-1)}
                                style={{
                                    border: "2px solid black",
                                    boxShadow: "3px 3px 0 black",
                                    backgroundColor: "#0d6efd",
                                }}
                            >
                                Back
                            </button>
                        </div>
                        {/* --- BATAS KOREKSI --- */}
                    </div>
                ) : (
                    <>
                        <div
                            style={{
                                border: "3px solid black",
                                borderRadius: "12px",
                                padding: "2rem",
                                backgroundColor: "white",
                                boxShadow: "6px 6px 0 #93c5fd",
                            }}
                        >
                            {/* --- KOREKSI 2 --- */}
                            <h2 className="fw-bold mb-3 text-break">Transaction ID: {transaction.id}</h2>
                            {/* --- BATAS KOREKSI --- */}
                            
                            <p className="mb-2">
                                <strong>Total Amount:</strong> Rp{" "}
                                {transaction.totalAmount.toLocaleString("id-ID")} <br />
                                <strong>Date:</strong>{" "}
                                {new Date(transaction.createdAt).toLocaleString()}
                            </p>

                            <h5 className="fw-bold mt-4">Items:</h5>
                            <div>
                                {transaction.items.map((item: any) => (
                                    <div
                                        key={item.bookId}
                                        style={{
                                            borderBottom: "2px solid #ccc",
                                            padding: "8px 0",
                                        }}
                                    >
                                        <p className="mb-1 fw-semibold text-break">{item.title}</p>
                                        <p className="mb-0">
                                            <strong>Quantity:</strong> {item.quantity} pcs <br />
                                            <strong>Unit Price:</strong> Rp {item.price.toLocaleString("id-ID")} <br />
                                            <strong>Total:</strong>{" "}
                                            Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                ))}

                            </div>
                        </div>
                        
                        {/* --- KOREKSI 1.C --- */}
                        <div className="d-grid d-sm-flex justify-content-sm-end mt-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="btn btn-primary fw-bold"
                                style={{
                                    border: "2px solid black",
                                    boxShadow: "3px 3px 0 black",
                                    backgroundColor: "#0d6efd",
                                }}
                            >
                                Back
                            </button>
                        </div>
                        {/* --- BATAS KOREKSI --- */}
                    </>
                )}
            </div>
        </div>
    );
}