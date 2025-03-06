import { z } from "@hono/zod-openapi";

export const signedInput = 
  z.object({
    email: z.string().email().openapi({ example: "harshit534@gmail.com" }),
    password: z.string().min(6).openapi({ example: "123456" }),
    name: z.string().optional().openapi({ example: "Harshit Rai" }),
  })


export const signedInInput = 
  z.object({
    email: z.string().email().openapi({ example: "harshit534@gmail.com" }),
    password: z.string().min(6).openapi({ example: "123456" }),
  })

export const createBlogInput = 
  z.object({
    title: z.string().openapi({ example: "My First Blog" }),
    desc: z.string().openapi({ example: "This is the description of my first blog post." }),
  })

export const updateBlogInput = 
  z.object({
    title: z.string().openapi({ example: "Updated Blog Title" }),
    desc: z.string().openapi({ example: "Updated description content." }),
    blogid: z.string().openapi({ example: "abc123" }),
  })

export type SignupInfer = z.infer<typeof signedInput>;
export type SigninInfer = z.infer<typeof signedInInput>;
export type CreateBlogInfer = z.infer<typeof createBlogInput>;
export type UpdateBlogInfer = z.infer<typeof updateBlogInput>;
