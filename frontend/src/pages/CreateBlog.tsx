import { useState, useCallback, useMemo } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Title } from "../components/Title";
import { InputField } from "../components/InputField";
import { useDebounce } from "../customhooks/useDebounce";
import { CustomButton } from "../components/CustomButton";

export const CreateBlog = () => {
    console.log("RERENDER")
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

    const handleSubmit = async () => {
        setLoading(true);

        if (!token) {
            alert("User not authenticated");
            setLoading(false);
            return;
        }

        try {
            await axios.post(
                `${BACKEND_URL}/api/v1/blog/create`,
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
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-5">
                <InputField label="Title" name="title" placeholder="Enter Title"  onChange={(e) => debouncedSetTitle(e.target.value)} />
                <InputField label="Description" name="desc" placeholder="Enter Description"  onChange={(e) => debouncedSetDesc(e.target.value)} />
               <div className="flex justify-center"> <CustomButton onclick={handleSubmit} label={loading ? "Creating..." : "Create Blog"} /></div>
            </div>
        </div>
    );
};
