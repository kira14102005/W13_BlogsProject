import { Context, Next } from "hono";

export const validateSignUp = async (c: Context, next: Next) => {
  const body = await c.req.json();
  const { success } = signedInput.safeParse(body);

  if (!success) {
    c.status(403);
    return c.json({ msg: "Invalid Input", inform: "Failed Zod Validation" });
  }
  await next(); 
};
export const validateSignIn = async (c: Context, next: Next) => {
    const body = await c.req.json();
    const { success } = signedInInput.safeParse(body);
  
    if (!success) {
      c.status(403);
      return c.json({ msg: "Invalid Input", inform: "Failed Zod Validation" });
    }
    await next(); 
  };
  
  export const validateCreateBlog = async (c: Context, next: Next) => {
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);
  
    if (!success) {
      c.status(403);
      return c.json({ msg: "Invalid Input", inform: "Failed Zod Validation" });
    }
  
    c.set("body", body);
    await next();
  };
  
  export const validateUpdateBlog = async (c: Context, next: Next) => {
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body);
  
    if (!success) {
      c.status(403);
      return c.json({ msg: "Invalid Input", inform: "Failed Zod Validation" });
    }
  
    c.set("body", body);
    await next();
  };
  