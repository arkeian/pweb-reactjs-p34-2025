import { useEffect, useState } from "react";
import { getMe } from "../api/auth";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

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
    <div>
      <h2>Dashboard</h2>

      {user ? (
        <p>Welcome, {user.username}!</p>
      ) : (
        <p>Loading user...</p>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
