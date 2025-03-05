import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Title } from "../components/Title";
import { useNavigate } from "react-router-dom";

interface Blog {
    id: string;
    title: string;
}

const BlogItem = ({ blog, index, token }: { blog: Blog; index: number, token: string | null }) => {
    const navigate = useNavigate();

    const handleClick = async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/api/v1/blog/${blog.id}`, { headers: { Authorization: `Bearer ${token}` }, });
            navigate(`/blog/${blog.id}`, { state: res.data.blog });
        } catch (error) {
            alert("Error fetching blog details");
        }
    };

    return (
        <div onClick={handleClick} className="cursor-pointer bg-white shadow-md rounded-md p-4 my-2 hover:bg-gray-100">
            <p className="text-lg font-semibold">
                {index + 1}. {blog.title}
            </p>
        </div>
    );
};

export const Blog = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    const getTokenFromCookies = useCallback(() => {
        const cookies = document.cookie.split("; ");
        const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
        return tokenCookie ? tokenCookie.split("=")[1] : null;
    }, []);

    const token = useMemo(getTokenFromCookies, []);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                if (!token) {
                    alert("User not authenticated");
                    setLoading(false);
                    return;
                }

                const res = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setBlogs(res.data.blogs || []);
            } catch (error) {
                alert("Error fetching blogs");
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [token]);

    if (loading) return <Title content="Loading Blogs..." />;
    if (blogs.length === 0) return <Title content="No Blogs Found" />;

    return (
        <div className="h-screen flex flex-col items-center p-5">
            <Title content="Your Blogs" />
            <div className="w-full max-w-2xl">
                {blogs.map((blog, index) => (
                    <BlogItem key={blog.id} blog={blog} index={index} token={token} />
                ))}
            </div>
        </div>
    );
};
