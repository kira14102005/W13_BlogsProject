import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { authMiddleware } from "../middlewares/auth";
import { STATUS_CODES } from "../lib/constant";
import { createBlogInput, updateBlogInput } from "@rrai21/iden34";
import { Context, Next } from "hono";
import { validateCreateBlog, validateUpdateBlog } from "../middlewares/validation";

export const blogRouter = new OpenAPIHono<{
  Bindings: { JWT_KEY: string; DATABASE_URL: string };
  Variables: { userId: string };
}>();

blogRouter.use("/*", authMiddleware);

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

const createBlogRoute = createRoute({
  method: "post",
  path: "/",
  summary: "Create a new blog post",
  tags: ["Blog"],
  request: {
    body: { content: { "application/json": { schema: createBlogInput } } },
  },
  responses: {
    200: {
      description: "Blog created successfully",
      content: { "application/json": { schema: { msg: "string", id: "string" } } },
    },
  },
});

const updateBlogRoute = createRoute({
  method: "put",
  path: "/",
  summary: "Update an existing blog post",
  tags: ["Blog"],
  request: {
    body: { content: { "application/json": { schema: updateBlogInput } } },
  },
  responses: {
    200: {
      description: "Blog updated successfully",
      content: { "application/json": { schema: { msg: "string", id: "string" } } },
    },
    404: { description: "Blog not found" },
  },
});

const getBlogRoute = createRoute({
  method: "get",
  path: "/{id}",
  summary: "Get a blog post by ID",
  tags: ["Blog"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "Blog fetched successfully",
      content: {
        "application/json": {
          schema: {
            msg: "string",
            blog: {
              id: "string",
              title: "string",
              desc: "string",
              published: "boolean",
              author: { name: "string", email: "string" },
            },
          },
        },
      },
    },
    404: { description: "Blog not found" },
  },
});

const getAllBlogsRoute = createRoute({
  method: "get",
  path: "/bulk",
  summary: "Get all blogs of the authenticated user",
  tags: ["Blog"],
  responses: {
    200: {
      description: "List of blogs",
      content: { "application/json": { schema: { blogs: [createBlogInput] } } },
    },
  },
});

blogRouter.openapi(createBlogRoute, async (c) => {
  //@ts-ignore
  const middlewareResponse = await runMiddleware(c, validateCreateBlog);
  if (middlewareResponse) return middlewareResponse;

  const prisma = getPrisma(c);
  const { title, desc } = await c.req.json();
  const authorId = c.get("userId");

  try {
    const blog = await prisma.post.create({ data: { authorId, title, desc } });
    return c.json({ msg: "Blog created successfully", id: blog.id }) as any;
  } catch (e: any) {
    c.status(STATUS_CODES.INTERNAL_ERROR);
    return c.json({ msg: "Error in blog creation", error: e.message });
  }
});

blogRouter.openapi(updateBlogRoute, async (c) => {
  //@ts-ignore
  const middlewareResponse = await runMiddleware(c, validateUpdateBlog);
  if (middlewareResponse) return middlewareResponse;

  const prisma = getPrisma(c);
  const { blogid, title, desc } = await c.req.json();

  try {
    const existingBlog = await prisma.post.findUnique({ where: { id: blogid } });
    if (!existingBlog) {
      c.status(STATUS_CODES.RESOURCE_NOT_FOUND);
      return c.json({ msg: "No blog found with the given ID" });
    }

    const updatedBlog = await prisma.post.update({ where: { id: blogid }, data: { title, desc } });
    return c.json({ msg: "Blog updated successfully", id: updatedBlog.id });
  } catch (e: any) {
    c.status(STATUS_CODES.INTERNAL_ERROR);
    return c.json({ msg: "Error updating blog", error: e.message });
  }
});

blogRouter.openapi(getBlogRoute, async (c) => {
  const prisma = getPrisma(c);
  const blogID = c.req.param("id");

  try {
    const blog = await prisma.post.findUnique({
      where: { id: blogID },
      select: {
        id: true,
        title: true,
        desc: true,
        published: true,
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
    return c.json({ msg: "Error in fetching blog", error: e.message });
  }
});

blogRouter.openapi(getAllBlogsRoute, async (c) => {
  const prisma = getPrisma(c);
  const authorId = c.get("userId");

  try {
    const blogs = await prisma.post.findMany({ where: { authorId } });
    return c.json({ blogs }) as any;
  } catch (e: any) {
    c.status(STATUS_CODES.INTERNAL_ERROR);
    return c.json({ msg: "Error fetching blogs", error: e.message });
  }
});

export default blogRouter;
