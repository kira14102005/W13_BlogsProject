import { verify, sign } from "hono/jwt";
import { Context, Next } from "hono";

export const generateToken = async (id: string, secret: string) => {
    return await sign({ id : id }, secret);
  };
  
export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    c.status(401);
    return c.json({ msg: "Unauthorized - No Token Provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = await verify(token, c.env.JWT_KEY);
    if (!decoded) throw new Error("Invalid Token");
    
    c.set("userId", decoded.id);
    await next();
  } catch (err) {
    c.status(403);
    return c.json({ msg: "Unauthorized - Invalid Token" });
  }
};
