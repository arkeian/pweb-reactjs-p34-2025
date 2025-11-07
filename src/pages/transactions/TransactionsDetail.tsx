import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { transactionApi } from "../../../../../pweb-reactjs-p34-2025/src/api/transactionApi";
import Card from "../../../../../pweb-reactjs-p34-2025/src/components/Card";
import Loader from "../../../../../pweb-reactjs-p34-2025/src/components/Loader";
import EmptyState from "../../../../../pweb-reactjs-p34-2025/src/components/EmptyState";
import Button from "../../../../../pweb-reactjs-p34-2025/src/components/Button";

interface BookItem {
    id: string;
    title: string;
    quantity: number;
    price: number;
}

interface TransactionDetailData {
    id: string;
    totalAmount: number;
    createdAt: string;
    items: BookItem[];
}

const TransactionDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [transaction, setTransaction] = useState<TransactionDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTransactionDetail = async () => {
        try {
            setLoading(true);
            const res = await transactionApi.getById(id!);

            const rawData = res.data.data;

            const mapped: TransactionDetailData = {
                id: rawData.id,
                totalAmount: rawData.totalAmount,
                createdAt: rawData.createdAt,
                items: rawData.items.map((item: any) => ({
                    id: item.bookId, // Map bookId to id
                    title: item.book?.title ?? "Unknown Book",
                    quantity: item.quantity,
                    price: item.price,
                })),
            };

            setTransaction(mapped);
        }
        catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch transaction detail.");
        }
        finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchTransactionDetail();
    }, [id]);

    if (loading) return <Loader text="Loading transaction detail..." />;

    if (error)
        return (
            <EmptyState
                title="Error loading transaction"
                message={error}
                actionLabel="Retry"
                onAction={fetchTransactionDetail}
            />
        );

    if (!transaction)
        return (
            <EmptyState
                title="Transaction Not Found"
                message="This transaction may have been deleted or does not exist."
                actionLabel="Back to Transactions"
                onAction={() => navigate("/transactions")}
            />
        );

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <Card title={`Transaction #${transaction.id.slice(0, 8)}...`}>
                <div className="space-y-3">
                    <p className="text-gray-700">
                        <strong>Date:</strong>{" "}
                        {new Date(transaction.createdAt).toLocaleString("id-ID")}
                    </p>
                    <p className="text-gray-700">
                        <strong>Total Amount:</strong> Rp {transaction.totalAmount.toLocaleString()}
                    </p>
                </div>

                <h3 className="text-lg font-semibold mt-6 mb-3">Items Purchased</h3>

                {transaction.items.length === 0 ? (
                    <EmptyState
                        title="No Books Found"
                        message="This transaction does not contain any items."
                    />
                ) : (
                    <div className="grid gap-4">
                        {transaction.items.map((item) => (
                            <div
                                key={item.id}
                                className="border-2 border-black rounded-md shadow-[3px_3px_0_#000] p-4 bg-white"
                            >
                                <p className="font-bold text-gray-800">{item.title}</p>
                                <p className="text-gray-700">Quantity: {item.quantity}</p>
                                <p className="text-gray-700">
                                    Price: Rp {item.price.toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-8">
                    <Button variant="secondary" onClick={() => navigate("/transactions")}>
                        Back to Transactions
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default TransactionDetail;
