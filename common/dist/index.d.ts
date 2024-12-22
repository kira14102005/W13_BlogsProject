import { z } from "zod";
export declare const signedInput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name?: string | undefined;
}, {
    email: string;
    password: string;
    name?: string | undefined;
}>;
export declare const signedInInput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const createBlogInput: z.ZodObject<{
    title: z.ZodString;
    desc: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    desc: string;
}, {
    title: string;
    desc: string;
}>;
export declare const updateBlogInput: z.ZodObject<{
    title: z.ZodString;
    desc: z.ZodString;
    blogid: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    desc: string;
    blogid: string;
}, {
    title: string;
    desc: string;
    blogid: string;
}>;
export type SignupInfer = z.infer<typeof signedInput>;
