import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify, sign, decode } from 'hono/jwt'
import { blogRouter } from '../routes/blogRouter'
import { userRouter } from '../routes/userRouter'
import { cors } from 'hono/cors'


 //BINDING TO HONO IN TYPESCRIPT IF U RE TRYING TO USE3 AN  ENV VARIABLE
const app = new Hono<{
  Bindings:{
    DATABASE_URL : string,
    JWT_KEY  : string
  }
}>()
app.use('/*', cors())
// app.use('/api/v1/blog/*' , async (c,next)=>{
//   const body =  await c.req.json();
//   const auth = await c.req.header("Authorization") || " "
// const token  =auth?.split(' ')[1];
//   const res = await verify(token , c.env.JWT_KEY)
// if(res.id){
//   await next()
// }
// else{
//   // c.status(403)
//   return c.json({
//     msg : 'WRONG JWT ',
//   token : token})
// }
// })
 //GPT SOLUTION FOR DIRECTLY CAUSING THE INTERNAL ERROR FAILURE  WE DO NEED TOUSE THE TRYCATCH  ALONG WITH

app.route('/api/v1/blog/', blogRouter)
app.route('/api/v1/user/', userRouter)


export default app
function split(auth: string | undefined) {
  throw new Error('Function not implemented.')
}

