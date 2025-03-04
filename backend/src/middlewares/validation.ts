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


