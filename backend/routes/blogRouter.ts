import { Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createBlogInput, updateBlogInput } from "@rrai21/iden34";
export const blogRouter = new Hono<{
    Bindings: {
        JWT_KEY: string,
        DATABASE_URL: string
    },
    Variables: {
        AuthorID: string
    }
}>();
blogRouter.use('/*', async (c, next) => {   //EXTRACT THE USER_ID FROM  HERE AND PASS IT DOWN THE ROUTES FROM HERE TO THE ROUTE HANDLER
    try {
        const auth = c.req.header("Authorization") || "";
        const token = auth?.split(' ')[1];
        if (!token) {
            return c.json({ msg: 'Token missing' }, 403);
        }

        const res = await verify(token, c.env.JWT_KEY);
        if (res.id) {
            c.set("AuthorID", res.id.toString())
            await next();
        } else {
            return c.json({ msg: 'Invalid JWT', token }, 403);
        }
    } catch (err: any) {
        console.error('JWT Verification Error:', err);
        return c.json({ msg: 'You are not logged in', error: err.message }, 403);
    }
});
blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const {success} = createBlogInput.safeParse(body);
    if(!success){
        c.status(403);
        return c.json({
            msg : "WRONG INPUTS",
            inform : "Failed Zod Validation"
        })
    }
    const authorID = c.get("AuthorID")
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    try {
        const r = await prisma.post.create({
            data: {
                authorId: authorID,
                title: body.title,
                desc: body.desc,
            }
        })
        return c.json({
            msg: "Blog Created successfully",
            id: r.id
        })
    } catch (e: any) {
        c.status(411)
        return c.text("Error in BLOG occurred")
    }
})
blogRouter.put('/', async (c) => {

    const body = await c.req.json();
    const {success} = updateBlogInput.safeParse(body);
    if(!success){
        c.status(403);
        return c.json({
            msg : "WRONG INPUTS",
            inform : "Failed Zod Validation"
        })
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    try {
        const r = await prisma.post.update({
            where: {
                id: body.blogid
            },
            data: {
                title: body.title,
                desc: body.desc,
            }
        })
        return c.json({
            msg: "Blog updated successfully",
            id: r.id
        })
    } catch (e: any) {
        c.status(411)
        return c.text("Error in BLOG Updation")
    }
})
blogRouter.get('/bulk', async (c) => {
    const authorID = c.get("AuthorID")

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    try {
        const r = await prisma.post.findMany({
            where: {
                authorId: authorID
            }
        })
        if (r && r.length > 0) {
            return c.json({
                blogs: r
            })
        }

    }
    catch (e: any) {
        c.status(411);
        return c.text("Error occurred ")
    }
})

blogRouter.get('/:id', async (c) => {
    const bID  = await c.req.param("id")
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    try {
        const r = await prisma.post.findUnique({
            where: {
                id:bID
            }
            ,
            select: {
                id: true,
                title: true,
                desc: true,
                author: {
                    select: {
                        name: true,
                        email: true,
                    }
                }
            }
        })
        if (r) {
            return c.json({
                msg: "Blog FETCHED successfully",
                id: r
            })
        }
        else {
            c.status(403)
            return c.json({
                msg: "Not a blog with given ID present",

            })
        }
    } catch (e: any) {
        c.status(411)
        return c.text("Error in BLOG occurred")
    }
})
