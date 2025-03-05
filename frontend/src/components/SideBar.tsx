import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-2 z-50 px-3 py-2 bg-gray-900 text-white rounded-md sm:hidden"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>

            </button>

            <aside
                className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-50 dark:bg-gray-800 transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } sm:translate-x-0 sm:w-64`}
                aria-label="Sidebar"
            >
                <div className="h-full px-3 py-4 overflow-y-auto">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 p-2 bg-gray-900 text-white rounded-md sm:hidden"
                    >
                        ✕
                    </button>

                    <ul className="space-y-2 font-medium mt-10 sm:mt-0">
                        <li>
                            <button
                                onClick={() => navigate("/blogs")}
                                className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                                <svg
                                    className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 22 21"
                                >
                                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                </svg>
                                <span className="ms-3">View Blogs</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </aside>

            {isOpen && <div className="fixed inset-0 bg-black opacity-50 sm:hidden" onClick={() => setIsOpen(false)}></div>}
        </>
    );
};
