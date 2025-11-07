import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import axiosClient from "../../../../pweb-reactjs-p34-2025/src/api/axiosClient";

interface User {
    id: string;
    username: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
}

interface MeResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        username: string;
        email: string;
    };
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    loading: true,
    login: async () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await axiosClient.get<MeResponse>("/auth/me");
                setUser(res.data.data);
            }
            catch (err) {
                console.error("Failed to fetch user:", err);
                localStorage.removeItem("token");
                setToken(null);
                setUser(null);
            }
            finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    const login = async (token: string) => {
        localStorage.setItem("token", token);
        setToken(token);
        try {
            const res = await axiosClient.get<MeResponse>("/auth/me");
            setUser(res.data.data);
        }
        catch (err) {
            console.error("Failed to fetch user after login:", err);
            logout();
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
