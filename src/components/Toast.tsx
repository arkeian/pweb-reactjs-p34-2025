import { useEffect, useState } from "react";

interface ToastProps {
    message: string;
    type?: "success" | "error" | "info";
    duration?: number;
    onClose: () => void;
}

export default function Toast({
    message,
    type = "info",
    duration = 3000,
    onClose,
}: ToastProps) {
    const [visible, setVisible] = useState(false);
    const [hasAnimatedIn, setHasAnimatedIn] = useState(false);

    useEffect(() => {
        const showTimer = setTimeout(() => {
            setVisible(true);
            setHasAnimatedIn(true);
        }, 50);

        const fadeTimer = setTimeout(() => setVisible(false), duration - 600);
        const removeTimer = setTimeout(onClose, duration);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, [duration, onClose]);

    const colors = {
        success: "#4ade80",
        error: "#f87171",
        info: "#60a5fa",
    };

    return (
        <div
            className="position-fixed start-50"
            style={{
                top: "20px",
                zIndex: 9999,
                transition:
                    "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-in-out",
                transform: visible
                    ? "translate(-50%, 0)"
                    : hasAnimatedIn
                        ? "translate(-50%, 0)"
                        : "translate(-50%, -120%)",
                opacity: visible ? 1 : 0,
            }}
        >
            <div
                style={{
                    backgroundColor: "white",
                    border: "3px solid black",
                    boxShadow: `6px 6px 0 ${colors[type]}`,
                    borderRadius: "12px",
                    padding: "14px 24px",
                    fontWeight: "bold",
                    fontFamily: "Poppins, sans-serif",
                    color: "black",
                    minWidth: "280px",
                    textAlign: "center",
                }}
            >
                {message}
            </div>
        </div>
    );
}
