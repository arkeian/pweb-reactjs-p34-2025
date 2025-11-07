import React from "react";
import Button from "./Button";

interface EmptyStateProps {
    title?: string;
    message?: string;
    actionLabel?: string;
    onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title = "No Data",
    message = "There's nothing to show here yet.",
    actionLabel,
    onAction,
}) => {
    return (
        <div className="flex flex-col items-center justify-center text-center py-16">
            <div className="w-24 h-24 border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0_#000] mb-6">
                <span className="text-4xl text-sky-500">📘</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-600 mb-6 max-w-sm">{message}</p>

            {actionLabel && onAction && (
                <Button variant="primary" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};

export default EmptyState;
