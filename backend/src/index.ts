import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { userRouter } from './router/userRouter'
import { blogRouter } from './router/blogRouter'


 //BINDING TO HONO IN TYPESCRIPT IF U RE TRYING TO USE3 AN  ENV VARIABLE
const app = new Hono<{
  Bindings:{
    DATABASE_URL : string,
    JWT_KEY  : string
  }
}>()
app.use('/*', cors())

app.route('/api/v1/blog/', blogRouter)
app.route('/api/v1/user/', userRouter)


export default app
function split(auth: string | undefined) {
  throw new Error('Function not implemented.')
}

