import { useNavigate } from "react-router-dom";
import { getToken } from "../api/auth";

export default function NotFound() {
    const navigate = useNavigate();

    const handleRedirect = () => {
        const token = getToken();
        if (token) {
            navigate("/books");
        } else {
            navigate("/");
        }
    };

    return (
        <div
            className="d-flex flex-column align-items-center justify-content-center vh-100 text-center p-3" // Tambah p-3
            style={{
                backgroundColor: "#f1f5f9",
                fontFamily: "'Poppins', sans-serif",
            }}
        >
            <div
                className="p-5"
                style={{
                    backgroundColor: "white",
                    border: "3px solid #000",
                    borderRadius: "10px",
                    boxShadow: "6px 6px 0 #000",
                    // --- KOREKSI 1 ---
                    width: "90%", // Tambahkan
                    maxWidth: "400px", // Tetap
                    // --- BATAS KOREKSI 1 ---
                }}
            >
                <h1 className="fw-bold text-primary" style={{ fontSize: "5rem" }}>
                    :(
                </h1>
                <h3 className="fw-bold text-dark mb-3">Page Not Found</h3>
                <p className="text-muted mb-4">
                    We couldn't find what you were looking for. Maybe it’s lost in the cloud?
                </p>

                <button
                    onClick={handleRedirect}
                    // --- KOREKSI 2 ---
                    className="btn btn-primary fw-bold w-100" // Tambah w-100
                    // --- BATAS KOREKSI 2 ---
                    style={{
                        border: "2px solid #000",
                        boxShadow: "4px 4px 0 #000",
                        backgroundColor: "#0d6efd",
                    }}
                >
                    Go Home
                </button>
            </div>
        </div>
    );
}