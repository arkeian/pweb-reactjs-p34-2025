import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { transactionApi } from "../../../../../pweb-reactjs-p34-2025/src/api/transactionApi";
import Card from "../../../../../pweb-reactjs-p34-2025/src/components/Card";
import Loader from "../../../../../pweb-reactjs-p34-2025/src/components/Loader";
import Pagination from "../../../../../pweb-reactjs-p34-2025/src/components/Pagination";
import EmptyState from "../../../../../pweb-reactjs-p34-2025/src/components/EmptyState";
import Input from "../../../../../pweb-reactjs-p34-2025/src/components/Input";
import Button from "../../../../../pweb-reactjs-p34-2025/src/components/Button";

interface TransactionItem {
    id: string;
    totalAmount: number;
    createdAt: string;
}

interface Meta {
    page: number;
    limit: number;
    total: number;
}

const TransactionsList: React.FC = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<TransactionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10, total: 0 });

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const res = await transactionApi.getAll({ page, search });
            setTransactions(res.data.data);
            if (res.data.meta) {
                setMeta(res.data.meta);
            } else {
                setMeta({ page: 1, limit: 10, total: 0 });
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to load transactions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [page, search]);

    if (loading) return <Loader text="Loading transactions..." />;
    if (error)
        return (
            <EmptyState
                title="Error loading transactions"
                message={error}
                actionLabel="Retry"
                onAction={fetchTransactions}
            />
        );

    if (!transactions.length)
        return (
            <EmptyState
                title="No Transactions Found"
                message="You haven’t made any purchases yet."
            />
        );

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <Input
                    label="Search Transaction ID"
                    placeholder="Enter transaction ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-1/2"
                />
                <Button variant="primary" onClick={() => fetchTransactions()}>
                    Search
                </Button>
            </div>

            <div className="grid gap-4">
                {transactions.map((txn) => (
                    <Card
                        key={txn.id}
                        title={`Transaction #${txn.id.slice(0, 8)}...`}
                        className="cursor-pointer hover:-translate-y-1 transition-transform"
                    >
                        <p className="text-gray-700">
                            <strong>Total:</strong> Rp {txn.totalAmount.toLocaleString()}
                        </p>
                        <p className="text-gray-600">
                            <strong>Date:</strong>{" "}
                            {new Date(txn.createdAt).toLocaleString("id-ID")}
                        </p>

                        <div className="mt-4">
                            <Button
                                variant="secondary"
                                onClick={() => navigate(`/transactions/${txn.id}`)}
                            >
                                View Details
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <Pagination
                currentPage={meta.page}
                totalPages={Math.ceil(meta.total / meta.limit)}
                onPageChange={(p: number) => setPage(p)}
            />
        </div>
    );
};

export default TransactionsList;
