import { useState, ChangeEvent } from "react";
import { Subtitle } from "./Subtitle";
import { Title } from "./Title";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SignupInfer } from "@rrai21/iden34";
import { BACKEND_URL } from "../config";
import { SubmitButton } from "./SubmitButton";
import { InputField } from "./InputField";
import { useDebounce } from "../customhooks/useDebounce";

type AuthType = { type: "signin" | "signup" };

export const Auth = ({ type }: AuthType) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupInfer>({
        email: "",
        name: "",
        password: "",
    });

    const debouncedSetPostInputs = useDebounce((updatedInputs: SignupInfer) => {
        setPostInputs(updatedInputs);
    }, 500);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        debouncedSetPostInputs({ ...postInputs, [name]: value });
    };

    const sendReq = async () => {
        try {
            const res = await axios.post(
                `${BACKEND_URL}/api/v1/user/${type}`,
                postInputs
            );
            const token = res.data.token;

            document.cookie = `token=${token}; path=/; Secure; SameSite=Strict`;

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            navigate("/");
        } catch {
            alert(`Error while ${type}`);
        }
    };

    return (
        <div className="h-screen flex flex-col justify-center items-center p-3">
            <Title
                content={
                    type === "signup"
                        ? "Create An Account"
                        : "Login With Your Credentials"
                }
            />
            <Subtitle
                content={
                    type === "signup"
                        ? "Already have an account?"
                        : "Create a new account."
                }
                linkText={type === "signup" ? "Login" : "Signup"}
                src={type === "signup" ? "/signin" : "/signup"}
            />
            <form
                className="flex flex-col m-5 w-full"
                onSubmit={(e) => {
                    e.preventDefault();
                    sendReq();
                }}
            >
                {type === "signup" && (
                    <InputField
                        label="Name"
                        name="name"
                        placeholder="Enter your name"
                        value={postInputs.name || ""}
                        onChange={handleChange}
                    />
                )}
                <InputField
                    label="Email"
                    name="email"
                    placeholder="Enter your email"
                    value={postInputs.email}
                    onChange={handleChange}
                />
                <InputField
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={postInputs.password}
                    onChange={handleChange}
                />
                <SubmitButton label={type === "signup" ? "Register" : "Login"} />
            </form>
        </div>
    );
};
