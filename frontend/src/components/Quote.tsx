import { useEffect, useState } from "react"

export const Quote = (props: any) => {
    const [quote, setQuote] = useState({
        msg: "",
        author: "anonymous",
        design : "Nonchalant"
    });
    useEffect(() => {
        setQuote({ msg: `"${props.msg}"`, author: props.author , design:props.design });
    }, [])
    return <>
        <div className="container bg-slate-200  h-screen  grid grid-rows-2">
            <div className="quote  p-1  flex justify-center items-center">
                <p className="text-center text-4xl font-bold">{quote.msg}</p>
            </div>
            <div className="author grod-rows-2 m-2 p-4">
               <p className=" text-lg font-mono">{quote.author}</p>
               <p className="text-slate-500	 text-xs font-serif">{quote.design}</p>
            </div>
        </div></>
}