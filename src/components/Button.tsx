import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger";
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    fullWidth = false,
    className = "",
    children,
    ...props
}) => {
    const base =
        "px-4 py-2 font-semibold border-2 border-black rounded-md shadow-[3px_3px_0_#000] transition transform active:translate-y-[2px]";

    const variants: Record<string, string> = {
        primary:
            "bg-sky-500 text-white hover:bg-sky-400 hover:translate-y-[-2px]",
        secondary:
            "bg-white text-sky-600 hover:bg-sky-50 hover:translate-y-[-2px]",
        danger:
            "bg-red-500 text-white hover:bg-red-400 hover:translate-y-[-2px]",
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""
                } ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
