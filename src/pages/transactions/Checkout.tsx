import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { transactionApi } from "../../../../../pweb-reactjs-p34-2025/src/api/transactionApi";
import { bookApi } from "../../../../../pweb-reactjs-p34-2025/src/api/bookApi";
import Loader from "../../../../../pweb-reactjs-p34-2025/src/components/Loader";
import Button from "../../../../../pweb-reactjs-p34-2025/src/components/Button";
import EmptyState from "../../../../../pweb-reactjs-p34-2025/src/components/EmptyState";
import Input from "../../../../../pweb-reactjs-p34-2025/src/components/Input";
import Card from "../../../../../pweb-reactjs-p34-2025/src/components/Card";
import toast from "react-hot-toast";

interface Book {
    id: string;
    title: string;
    price: number;
    stockQuantity: number;
}

interface CartItem {
    bookId: string;
    title: string;
    quantity: number;
    price: number;
}

const TransactionCheckout: React.FC = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState<Book[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(false);

    // Fetch available books
    const fetchBooks = async () => {
        try {
            setLoading(true);
            const res = await bookApi.getAll();
            setBooks(res.data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to load books.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleAddToCart = (book: Book) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.bookId === book.id);
            if (existing) {
                return prev.map((item) =>
                    item.bookId === book.id
                        ? {
                            ...item,
                            quantity: Math.min(item.quantity + 1, book.stockQuantity),
                        }
                        : item
                );
            }
            return [
                ...prev,
                { bookId: book.id, title: book.title, quantity: 1, price: book.price },
            ];
        });
    };

    const handleQuantityChange = (bookId: string, quantity: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.bookId === bookId
                    ? { ...item, quantity: Math.max(1, quantity) }
                    : item
            )
        );
    };

    const handleRemoveItem = (bookId: string) => {
        setCart((prev) => prev.filter((item) => item.bookId !== bookId));
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return toast("Your cart is empty.");

        setProcessing(true);
        try {
            const payload = {
                items: cart.map((item) => ({
                    bookId: item.bookId,
                    quantity: item.quantity,
                })),
            };

            const res = await transactionApi.create(payload);

            if (res.data?.success) {
                toast.success("Transaction successful!");
                navigate("/transactions");
            } else {
                toast.error("Failed to complete transaction.");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Error creating transaction.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <Loader text="Loading books..." />;

    if (error)
        return (
            <EmptyState
                title="Error loading books"
                message={error}
                actionLabel="Retry"
                onAction={fetchBooks}
            />
        );

    if (!books.length)
        return (
            <EmptyState
                title="No Books Found"
                message="There are currently no books available for purchase."
            />
        );

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Checkout — Select Books to Buy
            </h2>

            {/* Book List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                    <Card key={book.id} title={book.title}>
                        <p className="text-gray-700">Price: Rp {book.price.toLocaleString()}</p>
                        <p className="text-gray-600 text-sm">Stock: {book.stockQuantity}</p>
                        <Button
                            variant="primary"
                            className="mt-3"
                            onClick={() => handleAddToCart(book)}
                        >
                            Add to Cart
                        </Button>
                    </Card>
                ))}
            </div>

            {/* Cart Section */}
            <div className="mt-10 border-t border-gray-300 pt-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Cart</h3>

                {cart.length === 0 ? (
                    <p className="text-gray-600 italic">No items selected.</p>
                ) : (
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div
                                key={item.bookId}
                                className="flex justify-between items-center border-2 border-black rounded-md shadow-[3px_3px_0_#000] bg-white p-4"
                            >
                                <div>
                                    <p className="font-bold text-gray-800">{item.title}</p>
                                    <p className="text-gray-700">
                                        Price: Rp {item.price.toLocaleString()}
                                    </p>
                                    <p className="text-gray-700">
                                        Total: Rp {(item.price * item.quantity).toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Input
                                        type="number"
                                        value={item.quantity}
                                        min={1}
                                        max={99}
                                        onChange={(e) =>
                                            handleQuantityChange(item.bookId, parseInt(e.target.value))
                                        }
                                        className="w-16 text-center"
                                    />
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleRemoveItem(item.bookId)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {cart.length > 0 && (
                    <div className="mt-8 flex justify-between items-center">
                        <h4 className="text-lg font-semibold text-gray-800">
                            Total: Rp{" "}
                            {cart
                                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                                .toLocaleString()}
                        </h4>
                        <Button
                            variant="primary"
                            disabled={processing}
                            onClick={handleCheckout}
                        >
                            {processing ? "Processing..." : "Confirm Purchase"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionCheckout;
