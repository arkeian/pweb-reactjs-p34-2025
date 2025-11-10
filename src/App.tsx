import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import BooksList from "./pages/BooksList";
import BookDetail from "./pages/BookDetail";
import AddBook from "./pages/AddBook";
import Welcome from "./pages/Welcome";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import TransactionsList from "./pages/TransactionsList";
import TransactionsDetail from "./pages/TransactionsDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/books" element={<ProtectedRoute><BooksList /></ProtectedRoute>} />
        <Route path="/books/:id" element={<ProtectedRoute><BookDetail /></ProtectedRoute>} />
        <Route path="/books/add" element={<ProtectedRoute><AddBook /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><TransactionsList /></ProtectedRoute>} />
        <Route path="/transactions/:id" element={<ProtectedRoute><TransactionsDetail /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
