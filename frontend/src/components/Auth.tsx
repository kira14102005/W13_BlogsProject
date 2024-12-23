import { ChangeEvent, useEffect, useState } from "react"
import { Subtitle } from "./Subtitle"
import { Title } from "./Title"
import { SignupInfer } from "@rrai21/iden34"
import { BACKEND_URL } from "../config"
import axios from "axios"
import { useNavigate } from "react-router-dom"
type AuthType = { type: "signin" | "signup" }
export const Auth = ({ type }: AuthType) => {
        const navigate = useNavigate();
        const [postInputs, setPostInputs] = useState<SignupInfer>({                             ///INFER COMMON MODULE TYPE INFERENCCE HERE 
                email: "Example@gamil.com",
                name: "Harshit Rai",
                password: "12333344"
        })
        async function sendReq() {
                try {
                        const res = await axios.post(`${BACKEND_URL}/api/v1/user/${type === 'signup' ? "signup" : "signin"}`, postInputs);
                        const jwt = res.data.token;
                        localStorage.setItem("jwt", jwt);
                        navigate('/blogs')
                }
                catch(e){
                        alert(`Error while ${type === 'signin' ? "signing in" : "signing up"}`)
                }
        }
        return <>
                <div className="h-screen  flex flex-col justify-center items-center p-3">
                        <Title content={type === "signup" ? "Create An Account" : "Login With your Credentials"} />
                        <Subtitle content={type === "signup" ? "Already have an account?" : "Create a new account."} linkText={type === "signup" ? "Login" : "Signup"} src={type === "signup" ? "/signin" : "/signup"} />
                        <div className="flex flex-col m-5 w-full">
                                {type === "signup" ? (
                                        <Labelinput
                                                label="Name"
                                                placeholder="Enter your name"
                                                onchange={(e: any) => {
                                                        setPostInputs((c) => ({
                                                                ...c, // Keep all existing properties in `c`
                                                                name: e.target.value // Update only the `name` field
                                                        }));
                                                }}
                                        />
                                ) : (
                                        <div></div>
                                )}
                                <Labelinput label="Email" placeholder="Enter your email" onchange={(e: any) => {
                                        setPostInputs((c) => {  //UPDATE THE POSTINPUTS KEEEPING THE REST VALUES AS SAME JUST UPDATIN THE NAME FIELD
                                                return {
                                                        ...c,
                                                        email: e.target.value
                                                }
                                        })
                                }} />
                                <Labelinput label="Password" type="password" placeholder="Enter your password" onchange={(e: any) => {
                                        setPostInputs((c) => {  //UPDATE THE POSTINPUTS KEEEPING THE REST VALUES AS SAME JUST UPDATIN THE NAME FIELD
                                                return {
                                                        ...c,
                                                        password: e.target.value
                                                }
                                        })
                                }} />
                                <Submit onclick={sendReq} card={type === "signup" ? "Register" : "Login"} />
                        </div>
                </div></>
}
interface Labelinput {
        label: string,
        placeholder: string,
        onchange: (e: ChangeEvent<HTMLElement>) => void,
        type?: string          //PASSED IN OPTIONAL FIELD TYPE
}
function Labelinput({ label, placeholder, onchange, type }: Labelinput) {

        return <>
                <div className="flex flex-col mx-5 my-3 p-2">
                        <label className="block mb-2 pl-1 text-m font-semibold text-gray-900 ">{label}</label>
                        <input type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} onChange={onchange} required />
                </div></>
}
interface btn {
        card: string,
        onclick: () => Promise<void>
}
function Submit({ card, onclick }: btn) {
        return <>
                <div className="w-full  flex justify-center mt-4">
                        <button onClick={onclick} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded text-lg px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 w-1/2">{card}</button>
                </div></>
}