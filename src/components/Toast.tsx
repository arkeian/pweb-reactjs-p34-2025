import { Toaster } from "react-hot-toast";
import React from "react";

const Toast: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          border: "2px solid black",
          background: "white",
          color: "#111",
          padding: "12px 16px",
          fontFamily: "Poppins, sans-serif",
          boxShadow: "3px 3px 0 #000",
        },
        success: {
          iconTheme: { primary: "#0ea5e9", secondary: "#fff" },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "#fff" },
        },
      }}
    />
  );
};

export default Toast;
