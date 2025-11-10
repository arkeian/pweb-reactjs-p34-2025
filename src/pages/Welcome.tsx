import { useEffect, useState } from "react";

interface Overview {
    users: number;
    books: number;
    transactions: number;
}

export default function WelcomePage() {
    const [overview, setOverview] = useState<Overview>({
        users: 0,
        books: 0,
        transactions: 0,
    });

    useEffect(() => {
        setTimeout(() => {
            setOverview({
                users: 17,
                books: 20,
                transactions: 30,
            });
        }, 800);
    }, []);

    return (
        <div
            // --- KOREKSI DISINI ---
            // Ganti 'vh-100' (tinggi pasti) menjadi 'min-vh-100' (tinggi minimum)
            // 'py-5' ditambahkan agar konten tidak menempel di atas/bawah saat di-scroll
            className="d-flex flex-column justify-content-center align-items-center min-vh-100 text-center p-3 py-5"
            // --- BATAS KOREKSI ---
            style={{
                backgroundColor: "#ffffff",
                fontFamily: "Poppins, sans-serif",
            }}
        >
            <h1
                className="fw-bold mb-3 display-5 display-sm-3"
                style={{
                    color: "#0d6efd",
                    letterSpacing: "2px",
                }}
            >
                Welcome to IT Literature Shop!
            </h1>

            <p
                className="fs-5 mb-5"
                style={{
                    color: "#4b5563",
                }}
            >
                Explore our books and enjoy reading.
            </p>

            <div className="d-flex flex-column flex-sm-row gap-3 mb-5 w-100" style={{ maxWidth: "400px" }}>
                <a
                    href="/login"
                    className="btn fw-bold px-4 py-2 w-100 w-sm-auto"
                    style={{
                        backgroundColor: "#0d6efd",
                        color: "white",
                        border: "3px solid black",
                        boxShadow: "5px 5px 0 black",
                        borderRadius: "10px",
                    }}
                >
                    Login
                </a>
                <a
                    href="/register"
                    className="btn fw-bold px-4 py-2 w-100 w-sm-auto"
                    style={{
                        backgroundColor: "#0d6efd",
                        color: "white",
                        border: "3px solid black",
                        boxShadow: "5px 5px 0 black",
                        borderRadius: "10px",
                    }}
                >
                    Register
                </a>
            </div>


            <div
                className="d-flex justify-content-center align-items-center gap-4 flex-wrap"
                style={{
                    maxWidth: "800px",
                }}
            >
                <div
                    className="text-center fw-bold"
                    style={{
                        backgroundColor: "#ffffff",
                        color: "black",
                        padding: "30px 40px",
                        borderRadius: "10px",
                        border: "3px solid black",
                        boxShadow: "6px 6px 0 black",
                        minWidth: "180px",
                    }}
                >
                    <h2 className="fw-bold">{"+" + overview.users}</h2>
                    <p className="m-0">Users</p>
                </div>

                <div
                    className="text-center fw-bold"
                    style={{
                        backgroundColor: "#ffffff",
                        color: "black",
                        padding: "30px 40px",
                        borderRadius: "10px",
                        border: "3px solid black",
                        boxShadow: "6px 6px 0 black",
                        minWidth: "180px",
                    }}
                >
                    <h2 className="fw-bold">{"+" + overview.books}</h2>
                    <p className="m-0">Books</p>
                </div>

                <div
                    className="text-center fw-bold"
                    style={{
                        backgroundColor: "#ffffff",
                        color: "black",
                        padding: "30px 40px",
                        borderRadius: "10px",
                        border: "3px solid black",
                        boxShadow: "6px 6px 0 black",
                        minWidth: "180px",
                    }}
                >
                    <h2 className="fw-bold">{"+" + overview.transactions}</h2>
                    <p className="m-0">Transactions</p>
                </div>
            </div>

            <footer
                className="mt-5"
                style={{
                    color: "#6b7280",
                }}
            >
                © {new Date().getFullYear()} IT Literature Shop - P34
            </footer>
        </div>
    );
}