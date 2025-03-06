import { CustomButton } from "./CustomButton";

interface BlogCardProps {
    title: string;
    desc: string;
    authorName: string;
    authorEmail: string;
    published: boolean,
    handleEdit: () => void
}

export const BlogCard = ({ title, desc, authorName, authorEmail, published, handleEdit }: BlogCardProps) => {
    return (
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
            <div className="flex justify-between">  <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                {published ? <div className="flex flex-col-reverse"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
                </svg></div> : <div></div>}</div>
            <p className="mt-4 text-gray-700 text-lg">{desc}</p>
            <div className="mt-6 p-4 border-t border-gray-300 flex justify-between">
                <div><p className="text-sm text-gray-500">Written by:</p>
                    <p className="text-lg font-semibold text-gray-800">{authorName}</p>
                    <p className="text-sm text-gray-600">{authorEmail}</p></div>

                <div className="flex flex-col-reverse"> <CustomButton onclick={handleEdit} label="Edit Blog" /></div>
            </div>
        </div>
    );
};
