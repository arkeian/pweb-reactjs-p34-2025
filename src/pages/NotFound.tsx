import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-center">
            <h1 className="text-6xl font-bold mb-4 text-sky-600">404</h1>
            <p className="text-gray-700 text-lg mb-6">
                The page you are looking for doesn’t exist or has been moved.
            </p>
            <Button variant="primary" onClick={() => navigate("/")}>
                Go Home
            </Button>
        </div>
    );
};

export default NotFound;
