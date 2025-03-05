import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { authMiddleware } from "../middlewares/auth";
import { validateCreateBlog, validateUpdateBlog } from "../middlewares/validation";
import { STATUS_CODES } from "../lib/constant";

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

blogRouter.post("/", validateCreateBlog, async (c) => {
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
    c.status(STATUS_CODES.INTERNAL_ERROR);
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
    c.status(STATUS_CODES.INTERNAL_ERROR);
    return c.json({ msg: "Error fetching blogs", error: e.message });
  }
});

blogRouter.put("/", validateUpdateBlog, async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
      
    const body = await c.req.json();
  
    try {
      const updatedBlog = await prisma.post.update({
        where: { id: body.blogid },
        data: {
          title: body.title,
          desc: body.desc,
        },
      });
  
      return c.json({ msg: "Blog updated successfully", id: updatedBlog.id });
    } catch (e: any) {
      c.status(STATUS_CODES.INTERNAL_ERROR);
      return c.text("Error in BLOG updation");
    }
  });
  blogRouter.get("/:id", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
      
    const blogID = c.req.param("id");
  
    try {
      const blog = await prisma.post.findUnique({
        where: { id: blogID },
        select: {
          id: true,
          title: true,
          desc: true,
          author: { select: { name: true, email: true } },
        },
      });
  
      if (!blog) {
        c.status(STATUS_CODES.RESOURCE_NOT_FOUND);
        return c.json({ msg: "No blog found with the given ID" });
      }
  
      return c.json({ msg: "Blog fetched successfully", blog });
    } catch (e: any) {
      c.status(STATUS_CODES.INTERNAL_ERROR);
      return c.text("Error in fetching blog");
    }
  });
  