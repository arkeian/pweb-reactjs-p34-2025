import { useEffect, useState } from "react";
import { getMe } from "../api/auth";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getMe(token).then((res) => {
      setEmail(res.user.email);
    });
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav style={{ padding: "10px", background: "#ddd" }}>
      <Link to="/books">Books</Link> |{" "}
      <Link to="/transactions">Transactions</Link> 
      <span style={{ marginLeft: "20px" }}>Logged in as: {email}</span>

      <button
        onClick={logout}
        style={{ marginLeft: "20px", padding: "5px 10px" }}
      >
        Logout
      </button>
    </nav>
  );
}
