import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { authMiddleware, generateToken } from "../middlewares/auth";
import { STATUS_CODES } from "../lib/constant";
import { signedInput, signedInInput } from "@rrai21/iden34";
import { Context, Next } from "hono";
import { validateSignIn, validateSignUp } from "../middlewares/validation";

export const userRouter = new OpenAPIHono<{
  Bindings: { DATABASE_URL: string; JWT_KEY: string };
  Variables: { userId: string };
}>();

const getPrisma = (c: Context) =>
  new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

const runMiddleware = async (
  c: Context,
  middleware: (c: Context, next: Next) => Promise<void>
): Promise<Response | null> => {
  let isNextCalled = false;

  await middleware(c, async () => {
    isNextCalled = true;
  });

  return isNextCalled ? null : c.res;
};


const signUpRoute = createRoute({
  method: "post",
  path: "/signup",
  summary: "Register a new user",
  tags: ["User"],
  request: {
    body: { content: { "application/json": { schema: signedInput } } },
  },
  responses: {
    200: {
      description: "User registered successfully",
      content: { "application/json": { schema: { msg: "string", token: "string" } } },
    },
    400: { description: "Invalid Input" },
    409: { description: "User already exists" },
  },
});

const signInRoute = createRoute({
  method: "post",
  path: "/signin",
  summary: "Login an existing user",
  tags: ["User"],
  request: {
    body: { content: { "application/json": { schema: signedInInput } } },
  },
  responses: {
    200: {
      description: "User logged in successfully",
      content: { "application/json": { schema: { msg: "string", token: "string" } } },
    },
    401: { description: "Invalid credentials" },
  },
});

const meRoute = createRoute({
  method: "get",
  path: "/me",
  summary: "Get authenticated user details",
  tags: ["User"],
  responses: {
    200: {
      description: "User details fetched",
      content: { "application/json": { schema: { username: "string", email: "string" } } },
    },
    404: { description: "User not found" },
  },
});

userRouter.openapi(signUpRoute, async (c) => {
  //@ts-ignore
  const middlewareResponse = await runMiddleware(c, validateSignUp);
  if (middlewareResponse) return middlewareResponse;
  const prisma = getPrisma(c);
  const body = await c.req.json();
  try {
    const existingUser = await prisma.cand.findUnique({ where: { email: body.email } });
    console.log(existingUser)
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
  } catch {
    c.status(STATUS_CODES.INTERNAL_ERROR);
    return c.json({ msg: "Internal DB Error" });
  }
});

userRouter.openapi(signInRoute, async (c) => {
  //@ts-ignore

  const middlewareResponse = await runMiddleware(c, validateSignIn);
  if (middlewareResponse) return middlewareResponse;

  const prisma = getPrisma(c);
  const body = await c.req.json()

  try {
    const res = await prisma.cand.findUnique({ where: { email: body.email } });
    if (!res || res.password !== body.password) {
      c.status(STATUS_CODES.UNAUTHORIZED);
      return c.json({ msg: "Invalid credentials" });
    }

    const token = await generateToken(res.id, c.env.JWT_KEY);
    return c.json({ msg: "SIGNED IN SUCCESS", token });
  } catch {
    c.status(STATUS_CODES.INTERNAL_ERROR);
    return c.json({ msg: "Internal DB Error" });
  }
});

userRouter.openapi(meRoute, async (c) => {
  //@ts-ignore

  const middlewareResponse = await runMiddleware(c, authMiddleware);
  if (middlewareResponse) return middlewareResponse;

  const prisma = getPrisma(c);
  const userId = c.get("userId");
  try {
    const user = await prisma.cand.findUnique({ where: { id: userId } });
    if (!user) {
      c.status(STATUS_CODES.RESOURCE_NOT_FOUND);
      return c.json({ msg: "User not found" });
    }
    return c.json({ username: user.name, email: user.email });
  } catch {
    c.status(STATUS_CODES.INTERNAL_ERROR);
    return c.json({ msg: "Error fetching user details" });
  }
});

export default userRouter;
