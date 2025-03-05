import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Title } from "../components/Title";
import { Sidebar } from "../components/SideBar";

export const Home = () => {
    const [userName, setUserName] = useState<string | null>(null);

    const getTokenFromCookies = useMemo(() => {
        const cookies = document.cookie.split("; ");
        const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
        return tokenCookie ? tokenCookie.split("=")[1] : null;
    }, []);

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
            <Sidebar loggedIn= {userName!==null && userName!==undefined} />
            <div className="flex-1 flex flex-col items-center p-5">
                <Title content={`Welcome, ${userName || "Guest"}!`} />
                <p className="mt-4 text-gray-700">Navigate using the sidebar.</p>
            </div>
        </div>
    );
};
