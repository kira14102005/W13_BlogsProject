# Blogs Website

## Why I Built This 🛠️
I wanted to explore **type safety, validation, and modularity** in a full-stack project. Instead of directly jumping into a monorepo, I first created a **custom NPM package (`@rrai21/iden34`)** to share types and validation between the frontend and backend. This project helped me understand the differences between separate repositories and monorepos.

## Tech Stack 🚀
- **Frontend:** React, React Router
- **Backend:** Hono (running on Cloudflare Workers)
- **Database:** PostgreSQL (via Prisma ORM)
- **Validation:** Zod (via the custom NPM package)

## My Custom NPM Package: `@rrai21/iden34`
This package contains:
- **Shared Type Definitions** (for authentication, blog posts, etc.)
- **Zod Schema Validations** (ensuring API inputs are type-safe)
- **Reusability**: Used in both frontend and backend to avoid code duplication

### How I Used It:
#### In the Frontend:
```tsx
import { SignupInfer } from "@rrai21/iden34";

const [postInputs, setPostInputs] = useState<SignupInfer>({
  email: "example@gmail.com",
  name: "John Doe",
  password: "password123"
});
```

#### In the Backend:
```ts
import { SignupSchema } from "@rrai21/iden34";

app.post("/api/v1/user/signup", async (c) => {
  const body = await c.req.json();
  const parsed = SignupSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid input" }, 400);
  }
  // Proceed with Prisma logic
});
```

## Database & Prisma Setup 🗄️
I used **Prisma ORM** with PostgreSQL for structured, efficient database queries.

### Prisma Schema (`schema.prisma`)
```prisma
model User {
  id       String  @id @default(uuid())
  name     String
  email    String  @unique
  password String
  posts    Post[]
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
}
```

## How to Run Locally ⚡

### 1. Clone the Repository
```sh
git clone https://github.com/your-repo/blogs-website.git
cd blogs-website
```

### 2. Install Dependencies
#### Backend:
```sh
cd backend
npm install
```
#### Frontend:
```sh
cd frontend
npm install
```

### 3. Setup Database
```sh
npx prisma migrate dev --name init
```

### 4. Start the Project
#### Start Backend
```sh
npm run dev
```
#### Start Frontend
```sh
npm start
```

## Features ✅
- **User Authentication** (Sign up, Sign in using JWT)
- **Blog Creation & Viewing**
- **Type-Safe API Calls using Zod & Custom NPM Package**
- **Database Management with Prisma ORM**

## What’s Next? 🚀
- Transitioning this project into a **monorepo** for better structure
- Adding more **advanced Prisma queries** (pagination, filtering)
- Exploring **Cloudflare KV for caching**

---
This project started as an experiment but turned into a solid learning experience in **full-stack development, modularity, and database management**. 🚀
