import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { validateSignIn, validateSignUp } from "../middlewares/validation";
import { authMiddleware, generateToken } from "../middlewares/auth";
import { STATUS_CODES } from "../lib/constant";

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
      c.status(STATUS_CODES.USER_CONFLICT);
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
    c.status(STATUS_CODES.INTERNAL_ERROR);
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
        c.status(STATUS_CODES.UNAUTHORIZED);
        return c.text("USER NOT FOUND");
      }
  
      if (res.password !== body.password) {
        c.status(STATUS_CODES.UNAUTHORIZED)
        return c.text("WRONG PASSWORD");
      }
  
      const token = await generateToken(res.id, c.env.JWT_KEY);
      return c.json({ msg: "SIGNED IN SUCCESS", token });
    } catch (e) {
      c.status(STATUS_CODES.INTERNAL_ERROR);
      return c.json({ msg: "Internal Db error" });
    }
  });
  