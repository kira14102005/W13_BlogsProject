import {z} from "zod";
export const signedInput = z.object({
    email : z.string(),
    password : z.string().min(6),
    name : z.string().optional(),

})
export type SignupInfer = z.infer<typeof signedInput>