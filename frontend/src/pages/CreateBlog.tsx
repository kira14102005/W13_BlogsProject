import { useState, useCallback, useMemo } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Title } from "../components/Title";
import { InputField } from "../components/InputField";
import { useDebounce } from "../customhooks/useDebounce";

export const CreateBlog = () => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [loading, setLoading] = useState(false);

    const debouncedSetTitle = useDebounce(setTitle, 500);
    const debouncedSetDesc = useDebounce(setDesc, 500);

    const getTokenFromCookies = useCallback(() => {
        const cookies = document.cookie.split("; ");
        const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
        return tokenCookie ? tokenCookie.split("=")[1] : null;
    }, []);

    const token = useMemo(getTokenFromCookies, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!token) {
            alert("User not authenticated");
            setLoading(false);
            return;
        }

        try {
            await axios.post(
                `${BACKEND_URL}/api/v1/blog/`,
                { title, desc },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Blog Created Successfully!");
            setTitle("");
            setDesc("");
        } catch (error) {
            alert("Failed to create blog");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col items-center p-5">
            <Title content="Create a New Blog" />
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow-lg rounded-lg p-5">
                <InputField label="Title" name="title" placeholder="Enter Title" value={title} onChange={(e) => debouncedSetTitle(e.target.value)} />
                <InputField label="Description" name="desc" placeholder="Enter Description" value={desc} onChange={(e) => debouncedSetDesc(e.target.value)} />
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                    {loading ? "Creating..." : "Create Blog"}
                </button>
            </form>
        </div>
    );
};
