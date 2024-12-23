import { Subtitle } from "./Subtitle"
import { Title } from "./Title"

export const Auth = () => {
    return <>
        <div className="h-screen flex flex-col justify-center items-center">
<Title  content={"Create An Account"}/>
<Subtitle content={"Already have an account?"}  linkText={"Login"} src={"/signin"}/>
        </div></>
}
