import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import type { LoginRequest } from "../api/auth";
import Input from "../components/Input";
import Loader from "../components/Loader";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState<LoginRequest>({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(form);
            navigate("/books");
        } catch (err: any) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light p-3"> {/* Tambahkan padding 'p-3' */}
            <div
                className="p-4 nb-card"
                style={{
                    // --- KOREKSI DISINI ---
                    width: "90%",       // Ganti dari width: "400px"
                    maxWidth: "400px",  // Tambahkan maxWidth
                    // --- BATAS KOREKSI ---
                    backgroundColor: "white",
                    border: "3px solid black",
                    borderRadius: "10px",
                    boxShadow: "6px 6px 0 black",
                }}
            >
                <h2 className="fw-bold text-center mb-4 text-primary">Login</h2>

                {loading ? (
                    <Loader />
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="alert alert-danger text-center py-2">{error}</div>
                        )}
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter Email"
                        />
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter Password"
                        />

                        <button
                            type="submit"
                            className="btn btn-primary w-100 fw-semibold mt-2"
                            style={{
                                border: "2px solid black",
                                boxShadow: "4px 4px 0 black",
                            }}
                        >
                            Login
                        </button>

                        <p className="text-center mt-3">
                            Don't have an account?{" "}
                            <a href="/register" className="text-decoration-none text-primary">
                                Register here!
                            </a>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}