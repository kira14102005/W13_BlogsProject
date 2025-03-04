import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { validateSignIn, validateSignUp } from "../middlewares/validation";
import { authMiddleware, generateToken } from "../middlewares/auth";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_KEY: string;
  };
}>();

userRouter.post("/signup", validateSignUp, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  try {
    const res = await prisma.cand.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    });

    return c.json({ msg: "SIGNED UP SUCCESS" });
  } catch (e) {
    c.status(411);
    return c.json({ msg: "Some error occurred" });
  }
});

