import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Title } from "../components/Title";
import { Sidebar } from "../components/SideBar";
import { useNavigate } from "react-router-dom";

export const Home = () => {
    const [userName, setUserName] = useState<string | null>(null);
    const navigate = useNavigate();

    const getTokenFromCookies = useMemo(() => {
        const cookies = document.cookie.split("; ");
        const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
        return tokenCookie ? tokenCookie.split("=")[1] : null;
    }, []);
    const onLogout = () => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/";
    }
    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!getTokenFromCookies) return;
                const res = await axios.get(`${BACKEND_URL}/api/v1/user/me`, {
                    headers: { Authorization: `Bearer ${getTokenFromCookies}` },
                });
                setUserName(res.data.username);
            } catch {
                setUserName(null);
            }
        };

        fetchUser();
    }, [getTokenFromCookies]);

    return (
        <div className="h-screen flex">
            <Sidebar loggedIn={userName !== null && userName !== undefined} onLogout={onLogout}
            />
            <div className="flex-1 flex flex-col items-center p-5">
                <Title content={`Welcome, ${userName || "Guest"}!`} />
                <p className="mt-4 text-gray-700">Navigate using the sidebar.</p>

            </div>
        </div>
    );
};
