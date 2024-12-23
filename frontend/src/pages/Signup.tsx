import { Auth } from "../components/Auth"
import { Quote } from "../components/Quote"
export const Signup = () => {
    return <>
        <div className="w-screen grid grid-cols-1 md:grid-cols-2">
            <div className="">
                <Auth type="signup" />
            </div>
            <div className="invisible  md:visible"> <Quote msg="No  matter how much you try sometimes you can not change the results." author="Harshit Rai" design="CEO Apple"></Quote></div>
        </div></>
}