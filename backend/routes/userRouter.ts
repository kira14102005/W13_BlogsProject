import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify, sign, decode } from 'hono/jwt'
export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_KEY: string
    }
}>()
userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const body = await c.req.json();
    try {
        let res = await prisma.cand.create({
            data: {
                email: body.email,
                password: body.password,
                name: body.name
            }
        })
        const token = await sign({ id: res.id }, c.env.JWT_KEY)
        return c.json({
            msg: "SIGNED UP SUCCEESS",
            token: token
        })
    }
    catch (e: any) {
        c.status(411);
        return c.json({
            msg: "Some error occurred "
        })
    }
})
userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const body = await c.req.json();
    try {
        const res = await prisma.cand.findUnique({ where: { email: body.email } })
        if (!res) {
            c.status(403)
            return c.text('USER NOT FOUND')
        }
        if (res?.password != body.password) c.text('WRONG PASSWORD');
        const jwt = await sign({ id: res?.id }, c.env.JWT_KEY)
        return c.json({
            msg: "SIGNED IN SUCCEESS",
            token: jwt
        })
    }
    catch (e: any) {
        c.status(411);
        return c.json({
            msg: "Some error occurred "
        })
    }
})