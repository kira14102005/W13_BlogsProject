import {z} from "zod";
export const signedInput = z.object({
    email : z.string().email(),
    password : z.string().min(6),
    name : z.string().optional(),

})
export const signedInInput = z.object({
    email : z.string().email(),
    password : z.string().min(6),

})
export const createBlogInput = z.object({
    title : z.string(),
    desc : z.string(),

})
export const updateBlogInput = z.object({
    title : z.string(),
    desc : z.string(),
    blogid : z.string()

})

export type SignupInfer = z.infer<typeof signedInput>