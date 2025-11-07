import React from "react";

interface CardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = "" }) => {
    return (
        <div
            className={`bg-white border-4 border-black shadow-[6px_6px_0_#000] rounded-lg p-5 ${className}`}
        >
            {title && (
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
                    {title}
                </h2>
            )}
            <div>{children}</div>
        </div>
    );
};

export default Card;
