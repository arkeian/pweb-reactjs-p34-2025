import { useEffect, useState } from "react";
import { getMe } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getMe().then((res) => setUser(res.user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    // Wrapper utama disamakan dengan BooksList.tsx
    <div
      style={{
        backgroundColor: "#f0f9ff",
        minHeight: "100vh",
        fontFamily: "Poppins, sans-serif",
      }}
      // Tambahkan padding di atas untuk menggantikan ruang Navbar
      className="py-5" 
    >
      {/* <Navbar /> */} {/* <-- Navbar dihapus */}

      {/* Container Bootstrap */}
      <div className="container py-4">
        {/* Wrapper tambahan untuk memusatkan kartu dashboard */}
        <div className="row d-flex justify-content-center">
          <div className="col-md-8 col-lg-6">
            {/* Kartu dikonversi ke Bootstrap + style shadow dipertahankan */}
            <div
              className="bg-white p-4 p-md-5 rounded"
              style={{
                border: "4px solid black",
                boxShadow: "6px 6px 0 black",
              }}
            >
              {/* Class utility Tailwind diganti Bootstrap */}
              <h2 className="fs-2 fw-bold text-center text-primary mb-4">
                Dashboard
              </h2>

              {user ? (
                <p className="text-center fs-5 fw-semibold mb-4">
                  Welcome, <span className="text-primary">{user.username}</span>!
                </p>
              ) : (
                <p className="text-center text-muted mb-4">Loading user...</p>
              )}

              {/* Tombol diganti ke class Bootstrap (btn, btn-danger, dll) */}
              <div className="d-grid gap-3 mt-4">

                <button
                  onClick={() => navigate("/books/add")}
                  className="btn btn-success fw-bold"
                  style={{
                    border: "2px solid black",
                    boxShadow: "4px 4px 0 black",
                  }}
                >
                  Add Book
                </button>

                <button
                  onClick={() => navigate("/books")}
                  className="btn btn-warning fw-bold"
                  style={{
                    border: "2px solid black",
                    boxShadow: "4px 4px 0 black",
                  }}
                >
                  Books List
                </button>
                
                <button
                  onClick={handleLogout}
                  className="btn btn-danger fw-bold text-white"
                  style={{
                    border: "2px solid black",
                    boxShadow: "4px 4px 0 black",
                  }}
                >
                  Logout
                </button>
              </div>

              {/* Info section dikonversi ke Bootstrap */}
              <div className="mt-5">
                <h3 className="fs-5 fw-bold text-primary mb-2">Quick Info</h3>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item bg-transparent">Total Books: 123</li>
                  <li className="list-group-item bg-transparent">Pending Orders: 5</li>
                  <li className="list-group-item bg-transparent">Registered Users: 45</li>
                </ul>
              </div>

              <div className="mt-4">
                <h3 className="fs-5 fw-bold text-primary mb-2">Tips</h3>
                <p className="text-dark fw-medium">
                  You can add new books or manage existing ones from the Books
                  List.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}