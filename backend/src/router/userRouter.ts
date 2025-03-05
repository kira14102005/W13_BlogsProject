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
    const existingUser = await prisma.cand.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      c.status(409);
      return c.json({ msg: "User already exists" });
    }

    const res = await prisma.cand.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    });

    const token = await generateToken(res.id, c.env.JWT_KEY);
    return c.json({ msg: "SIGNED UP SUCCESS", token });
  } catch (e) {
    c.status(500);
    return c.json({ msg: "Internal DB Error" });
  }
});

userRouter.post("/signin", validateSignIn, async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const body = await c.req.json();
  
    try {
      const res = await prisma.cand.findUnique({ where: { email: body.email } });
  
      if (!res) {
        c.status(403);
        return c.text("USER NOT FOUND");
      }
  
      if (res.password !== body.password) {
        c.status(401)
        return c.text("WRONG PASSWORD");
      }
  
      const token = await generateToken(res.id, c.env.JWT_KEY);
      return c.json({ msg: "SIGNED IN SUCCESS", token });
    } catch (e) {
      c.status(500);
      return c.json({ msg: "Internal Db error" });
    }
  });
  