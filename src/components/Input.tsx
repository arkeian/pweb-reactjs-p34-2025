import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = "", ...props }) => {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {label && (
                <label className="font-semibold text-gray-800 text-sm">{label}</label>
            )}
            <input
                {...props}
                className={`px-4 py-2 border-2 border-black rounded-md bg-white text-gray-800 focus:outline-none focus:ring-4 focus:ring-sky-300 focus:border-sky-500 shadow-[2px_2px_0_#000] transition-all`}
            />
            {error && <span className="text-red-500 text-xs">{error}</span>}
        </div>
    );
};

export default Input;
