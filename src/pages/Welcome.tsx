import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 32, textAlign: "center" }}>
      <h1>Welcome to IT Literature Shop!</h1>
      <p>Explore our books and enjoy reading.</p>

      <div style={{ marginTop: 24 }}>
        <button onClick={() => navigate("/login")} style={{ marginRight: 12 }}>
          Login
        </button>
        <button onClick={() => navigate("/register")}>
          Register
        </button>
      </div>

      <div style={{ marginTop: 40 }}>
        <h3>Featured Books:</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>"Bismillah Sukses" — Edward Johnson</li>
          <li>"Cara Menjadi Lelaki Sejati" — Asep</li>
          <li>"Ikhlas Tekan Ati" — Bibimbap</li>
        </ul>
      </div>
    </div>
  );
}
