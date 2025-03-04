import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { authMiddleware } from "../middlewares/auth";
import { validateCreateBlog, validateUpdateBlog } from "../middlewares/validation";

export const blogRouter = new Hono<{
  Bindings: {
    JWT_KEY: string;
    DATABASE_URL: string;
  };
  Variables: {
    userId: string;
  };
}>();


blogRouter.use("/*", authMiddleware);

blogRouter.post("/create", validateCreateBlog, async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
      
  const body = await c.req.json();
  const authorID = c.get("userId");

  try {
    const blog = await prisma.post.create({
      data: {
        authorId: authorID,
        title: body.title,
        desc: body.desc,
      },
    });

    return c.json({ msg: "Blog Created successfully", id: blog.id });
  } catch (e: any) {
    c.status(500);
    return c.json({ msg: "Error in blog creation", error: e.message });
  }
});
blogRouter.get("/bulk", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
      
  const authorID = c.get("userId");

  try {
    const blogs = await prisma.post.findMany({ where: { authorId: authorID } });

    return c.json({ blogs });
  } catch (e: any) {
    c.status(500);
    return c.json({ msg: "Error fetching blogs", error: e.message });
  }
});

