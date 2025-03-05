import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Title } from "../components/Title";
import { Quote } from "../components/Quote";

interface Blog {
    id: string;
    title: string;
    desc: string;
    authorId: string;
}

export const Blog = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    const getTokenFromCookies = useMemo(() => {
        const cookies = document.cookie.split("; ");
        const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
        return tokenCookie ? tokenCookie.split("=")[1] : null;
    }, []);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const token = getTokenFromCookies;
                if (!token) {
                    alert("User not authenticated");
                    setLoading(false);
                    return;
                }

                console.log("Token:", token);
                const res = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("Blogs Response:", res.data.blogs);
                setBlogs(res.data.blogs || []);
            } catch (error) {
                console.error("Error fetching blogs:", error);
                alert("Error fetching blogs");
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [getTokenFromCookies]); // Dependency to ensure `getTokenFromCookies` is stable

    if (loading) {
        console.log("Showing Loading Blogs...");
        return <Title content="Loading Blogs..." />;
    }

    if (!loading && blogs.length === 0) {
        console.log("No blogs found");
        return <Title content="No Blogs Found" />;
    }

    return (
        <div className="h-screen flex flex-col items-center p-5">
            <Title content="Your Blogs" />
            <div className="w-full max-w-2xl">
                {blogs.map((blog) => (
                    <div key={blog.id} className="bg-white shadow-lg rounded-lg p-5 my-4">
                        <Quote msg={blog.title} author={`By Author ID: ${blog.authorId}`} design="Elegant" />
                        <p className="mt-2 text-gray-600">{blog.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
