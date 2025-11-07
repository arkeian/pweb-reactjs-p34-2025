import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname === "/login" || location.pathname === "/register") {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-white border-b-4 border-black shadow-[0_4px_0_#000] mb-6">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link
                    to="/books"
                    className="font-extrabold text-2xl text-sky-600 tracking-tight hover:translate-y-[-2px] transition-transform"
                >
                    IT Literature
                </Link>

                <div className="flex gap-6">
                    <Link
                        to="/books"
                        className="font-medium text-gray-800 hover:text-sky-600 transition"
                    >
                        Books
                    </Link>
                    <Link
                        to="/transactions"
                        className="font-medium text-gray-800 hover:text-sky-600 transition"
                    >
                        Transactions
                    </Link>
                    <Link
                        to="/checkout"
                        className="font-medium text-gray-800 hover:text-sky-600 transition"
                    >
                        Checkout
                    </Link>
                </div>

                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{user.email}</span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-sky-500 text-white font-semibold border-2 border-black rounded-md shadow-[3px_3px_0_#000] hover:translate-y-[-2px] active:translate-y-[2px] transition"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="px-4 py-2 border-2 border-black bg-sky-500 text-white font-semibold shadow-[3px_3px_0_#000] hover:translate-y-[-2px] transition"
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
