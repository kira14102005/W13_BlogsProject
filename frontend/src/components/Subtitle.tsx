import { Link } from "react-router-dom";
export const Subtitle = ({ content, src, linkText } : {content : string , src : string , linkText  : string}) => {
    return <>
        <div className="text-center text-slate-400 flex flex-rows-2"><div>{content}</div>
            <Link className="ml-1 underline hover:text-black underline-offset-2" to={`${src}`}>{linkText}</Link></div>
    </>

}