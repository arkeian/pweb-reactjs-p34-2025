import { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { getMe } from "../api/auth";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    getMe(token)
      .then(() => setValid(true))
      .catch(() => {
        localStorage.removeItem("token");
        setValid(false);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!valid) return <Navigate to="/login" replace />;

  return children;
}
