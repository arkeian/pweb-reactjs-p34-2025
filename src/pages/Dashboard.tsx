import { useEffect, useState } from "react";
import { getMe } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getMe(token).then((res) => setUser(res.user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Dashboard</h2>

      {user ? (
        <p>Welcome, {user.username}!</p>
      ) : (
        <p>Loading user...</p>
      )}

      <div style={{ marginTop: 24 }}>
        <button onClick={handleLogout} style={{ marginRight: 12 }}>
          Logout
        </button>
        <button onClick={() => navigate("/books")} style={{ marginRight: 12 }}>
          Go to Books List
        </button>
        <button onClick={() => navigate("/books/add")}>
          Add New Book
        </button>
      </div>

      <div style={{ marginTop: 40 }}>
        <h3>Quick Info</h3>
        <ul>
          <li>Total Books: 123</li>
          <li>Pending Orders: 5</li>
          <li>Registered Users: 45</li>
        </ul>
      </div>

      <div style={{ marginTop: 24 }}>
        <h3>Tips:</h3>
        <p>You can add new books or manage existing ones from the Books List.</p>
      </div>
    </div>
  );
}
