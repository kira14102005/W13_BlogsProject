import { ChangeEvent } from "react";

interface InputFieldProps {
    label: string;
    name: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

export const InputField = ({
    label,
    name,
    placeholder,
    onChange,
    type = "text",
}: InputFieldProps) => (
    <div className="flex flex-col mx-5 my-3 p-2">
        <label className="block mb-2 pl-1 text-m font-semibold text-gray-900">
            {label}
        </label>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
        />
    </div>
);
