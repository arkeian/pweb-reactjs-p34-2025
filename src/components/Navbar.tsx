import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
    };

    return (
        <nav
            // --- KOREKSI DISINI ---
            className="d-flex flex-column flex-sm-row justify-content-sm-between align-items-start align-items-sm-center px-4 py-3 gap-3 gap-sm-0"
            // --- BATAS KOREKSI ---
            style={{
                backgroundColor: "#0ea5e9",
                borderBottom: "3px solid black",
                boxShadow: "0 4px 0 black",
                fontFamily: "Poppins, sans-serif",
            }}
        >
            <h4
                onClick={() => navigate("/dashboard")}
                style={{
                    fontWeight: "bold",
                    color: "white",
                    cursor: "pointer",
                    margin: 0, // Tambahkan m-0 untuk konsistensi
                }}
            >
                IT Literature Shop
            </h4>

            {token && (
                // --- KOREKSI DISINI ---
                // Buat tombol stack ke bawah di HP (flex-column)
                // dan menyamping di sm ke atas (flex-sm-row)
                <div className="d-flex flex-column flex-sm-row gap-3">
                    {location.pathname.startsWith("/books") ? (
                        <button
                            onClick={() => navigate("/checkout")}
                            className="btn btn-light fw-bold"
                            style={{
                                border: "2px solid black",
                                boxShadow: "3px 3px 0 black",
                            }}
                        >
                            Checkout
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate("/books")}
                            className="btn btn-light fw-bold"
                            style={{
                                border: "2px solid black",
                                boxShadow: "3px 3px 0 black",
                            }}
                        >
                            Books
                        </button>
                    )}

                    <button
                        onClick={() => navigate("/transactions")}
                        className="btn btn-light fw-bold"
                        style={{
                            border: "2px solid black",
                            boxShadow: "3px 3px 0 black",
                        }}
                    >
                        History
                    </button>

                    <button
                        onClick={handleLogout}
                        className="btn btn-danger fw-bold"
                        style={{
                            border: "2px solid black",
                            boxShadow: "3px 3px 0 black",
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
}