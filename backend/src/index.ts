import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { userRouter } from "./router/userRouter";
import { blogRouter } from "./router/blogRouter";
import { swaggerUI } from "@hono/swagger-ui";

const app = new OpenAPIHono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_KEY: string;
  };
}>();

app.use("/*", cors());

app.route("/api/v1/blog", blogRouter);
app.route("/api/v1/user", userRouter);

app.doc("/doc", {
  openapi: "3.0.1",
  info: {
    title: "My API",
    version: "1.0.0",
  },
});

app.get("/swagger", swaggerUI({ url: "/doc" }));

export default app;
