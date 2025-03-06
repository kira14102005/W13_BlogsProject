import { createBlogInput, signedInInput, signedInput, updateBlogInput } from "@rrai21/iden34";
import { Context, Next } from "hono";
import { STATUS_CODES } from "../lib/constant";

const validateInput = async (c: Context, next: Next, schema: any) => {
  const body = await c.req.json();
  const parsed = schema.safeParse(body);
console.log(body)
  if (!parsed.success) {
    c.status(STATUS_CODES.BAD_REQUEST);
    return c.json({ msg: "Invalid Input", inform: "Failed Zod Validation" });
  }

  c.set("body", body);
  await next();
};

export const validateSignUp = (c: Context, next: Next) => validateInput(c, next, signedInput);
export const validateSignIn = (c: Context, next: Next) => validateInput(c, next, signedInInput);
export const validateCreateBlog = (c: Context, next: Next) => validateInput(c, next, createBlogInput);
export const validateUpdateBlog = (c: Context, next: Next) => validateInput(c, next, updateBlogInput);
