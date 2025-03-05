import { useLocation } from "react-router-dom";
import { Title } from "../components/Title";
import { BlogCard } from "../components/BlogCard";

interface Blog {
    id: string;
    title: string;
    desc: string;
    author: {
        name: string;
        email: string;
    };
    published : boolean
}

export const BlogDetails = () => {
    const location = useLocation();
    const blog: Blog | undefined = location.state;

    if (!blog) return <Title content="Blog Not Found" />;

    return (
        <div className="h-screen flex flex-col items-center p-5">
            <BlogCard
                title={blog.title}
                desc={blog.desc}
                authorName={blog.author.name}
                authorEmail={blog.author.email}
                published  = {blog.published}
            />
        </div>
    );
};
