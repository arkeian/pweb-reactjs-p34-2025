import React from "react";
import Button from "./Button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    if (totalPages <= 1) return null;

    const handlePrevious = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`px-3 py-1 border-2 border-black mx-1 font-semibold shadow-[2px_2px_0_#000] rounded-md ${i === currentPage
                            ? "bg-sky-500 text-white"
                            : "bg-white text-gray-800 hover:bg-sky-50"
                        } transition`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-3 mt-6">
            <Button
                variant="secondary"
                onClick={handlePrevious}
                disabled={currentPage === 1}
            >
                Previous
            </Button>

            <div className="flex items-center">{renderPageNumbers()}</div>

            <Button
                variant="secondary"
                onClick={handleNext}
                disabled={currentPage === totalPages}
            >
                Next
            </Button>
        </div>
    );
};

export default Pagination;
