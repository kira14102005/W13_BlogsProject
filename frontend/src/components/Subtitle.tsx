import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
export const Subtitle = ({content , src,linkText})=>{
    const  [text, setText] = useState("");
    useEffect(()=>{
        setText(content)
    } ,[])
    return <>
    <div className="text-center text-slate-400 flex flex-rows-2"><div>{text}</div>
    <Link className="ml-1 underline hover:text-black underline-offset-2"to={`${src}`}>{linkText}</Link></div>
    </>

}