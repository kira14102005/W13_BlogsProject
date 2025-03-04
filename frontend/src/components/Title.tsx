import { useEffect, useState } from "react";

export const Title = ({ content }: { content: string }) => {
    const [text, setText] = useState("");
    useEffect(() => {
        setText(content)
    }, [])
    return <>
        <div className="text-center font-bold text-3xl">{text}</div>
    </>
}