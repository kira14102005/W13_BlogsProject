import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Title } from "../components/Title";
import { InputField } from "../components/InputField";
import { useDebounce } from "../customhooks/useDebounce";

export const UpdateBlog = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const blog = location.state;

    const [title, setTitle] = useState(blog?.title || "");
    const [desc, setDesc] = useState(blog?.desc || "");
    const [loading, setLoading] = useState(false);

    const debouncedSetTitle = useDebounce(setTitle, 500);
    const debouncedSetDesc = useDebounce(setDesc, 500);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
            if (!token) {
                alert("User not authenticated");
                setLoading(false);
                return;
            }

            await axios.put(
                `${BACKEND_URL}/api/v1/blog/`,
                { blogid: blog.id, title, desc },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Blog updated successfully!");
            navigate(`/blog/${blog.id}`, { state: { ...blog, title, desc } });
        } catch (error) {
            alert("Failed to update blog");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col items-center p-5">
            <Title content="Update Blog" />
            <form onSubmit={handleUpdate} className="w-full max-w-md bg-white shadow-lg rounded-lg p-5">
                <InputField label="Title" name="title" placeholder="Enter Title" value={title} onChange={(e) => debouncedSetTitle(e.target.value)} />
                <InputField label="Description" name="desc" placeholder="Enter Description" value={desc} onChange={(e) => debouncedSetDesc(e.target.value)} />
                <div className="w-full justify-center flex">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-1/2 relative inline-flex items-center justify-center font-semibold p-0.5 mb-2 me-2 overflow-hidden text-md font-medium 
        rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 
        ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-teal-400 hover:to-lime-400'} 
        dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800`}
                    >
                        <span
                            className={`w-full relative px-5 py-2.5 transition-all ease-in duration-75 
            ${loading ? 'bg-gray-300 dark:bg-gray-700' : 'bg-white dark:bg-gray-900 group-hover:bg-transparent group-hover:dark:bg-transparent'} 
            rounded-md`}
                        >
                            {loading ? "Updating..." : "Update Blog"}
                        </span>
                    </button>
                </div>
            </form>
        </div>
    );
};
