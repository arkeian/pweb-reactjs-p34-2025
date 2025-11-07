import React from "react";

interface LoaderProps {
    text?: string;
    size?: "sm" | "md" | "lg";
}

const Loader: React.FC<LoaderProps> = ({ text = "Loading...", size = "md" }) => {
    const sizes = {
        sm: "w-5 h-5 border-2",
        md: "w-8 h-8 border-4",
        lg: "w-12 h-12 border-4",
    };

    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div
                className={`${sizes[size]} border-black border-t-transparent rounded-full animate-spin`}
            ></div>
            {text && (
                <p className="mt-4 text-gray-700 font-medium text-sm tracking-wide">
                    {text}
                </p>
            )}
        </div>
    );
};

export default Loader;
