import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import type { RegisterRequest } from "../api/auth";
import Input from "../components/Input";
import Loader from "../components/Loader";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState<RegisterRequest>({
        username: "",
        email: "",
        password: "",
    });

    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (form.password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const res = await register(form);
            setSuccess(res.message);
            setTimeout(() => navigate("/login"), 1500);
        } catch (err: any) {
            setError(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        // --- KOREKSI DISINI ---
        // Ganti vh-100 menjadi min-vh-100
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-3">
        {/* --- BATAS KOREKSI --- */}
            
            <div
                className="p-4 nb-card"
                style={{
                    width: "90%",
                    maxWidth: "400px",
                    backgroundColor: "white",
                    border: "3px solid black",
                    borderRadius: "10px",
                    boxShadow: "6px 6px 0 black",
                }}
            >
                <h2 className="fw-bold text-center mb-4 text-primary">Register</h2>

                {loading ? (
                    <Loader />
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="alert alert-danger text-center py-2">{error}</div>
                        )}
                        {success && (
                            <div className="alert alert-success text-center py-2">
                                {success}
                            </div>
                        )}

                        <Input
                            label="Username"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Enter Username"
                        />
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
                            placeholder="Enter Password"
                            value={form.password}
                            onChange={handleChange}
                        />
                        <Input
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <button
                            type="submit"
                            className="btn btn-primary w-100 fw-semibold mt-2"
                            style={{
                                border: "2px solid black",
                                boxShadow: "4px 4px 0 black",
                            }}
                        >
                            Register
                        </button>

                        <p className="text-center mt-3">
                            Already have an account?{" "}
                            <a href="/login" className="text-decoration-none text-primary">
                                Login here!
                            </a>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}