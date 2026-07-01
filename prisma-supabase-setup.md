# Prisma + Supabase Database Setup

## Step 1 — Install Prisma

```bash
pnpm add -D prisma
pnpm add @prisma/client
npx prisma init
```

---

## Step 2 — Get your Supabase connection strings

1. Supabase project → **Settings → Database**
2. Scroll to **Connection string** → **URI** tab
3. Copy both strings:

| Variable | Source | Purpose |
|---|---|---|
| `DATABASE_URL` | Session pooler (port `5432`) | Prisma Migrate |
| `DIRECT_URL` | Direct connection | Prisma Client runtime |

---

## Step 3 — Configure `.env`

```env
# Session pooler – used by Prisma migrations
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Direct connection – used by Prisma Client at runtime
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@db.[project-ref].supabase.co:5432/postgres"
```

Add `.env` to `.gitignore`.

---

## Step 4 — Update `prisma/schema.prisma`

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

---

## Step 5 — Run initial migration

```bash
npx prisma migrate dev --name init
```

Verify in Supabase → **Table Editor** that tables were created.

---

## Step 6 — Seed

```bash
npx prisma db seed
```

---

## Step 7 — Verify

```bash
npx prisma studio
```

Opens at `localhost:5555` to browse your data.

---

## Multi-file Schema (One file per model, like Laravel)

Prisma 5.15+ supports `prismaSchemaFolder` — split models into separate `.prisma` files.

### Folder structure

```
prisma/
├── schema/
│   ├── base.prisma        ← generator + datasource
│   ├── enums.prisma       ← all enums in one place
│   ├── user.prisma        ← User model
│   ├── post.prisma        ← Post model
│   └── comment.prisma     ← Comment model
```

### base.prisma

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["prismaSchemaFolder"]
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### enums.prisma — central enum file

All enums live here. Add new ones as your app grows.

```prisma
enum Role {
  USER
  ADMIN
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

### user.prisma

```prisma
model User {
  id        String    @id @default(cuid())
  name      String
  email     String    @unique
  role      Role      @default(USER)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  posts     Post[]
  comments  Comment[]
}
```

### post.prisma

```prisma
model Post {
  id        String    @id @default(cuid())
  title     String
  content   String
  published Boolean   @default(false)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  authorId  String
  author    User      @relation(fields: [authorId], references: [id], onDelete: Cascade)

  comments  Comment[]
}
```

### comment.prisma

```prisma
model Comment {
  id        String   @id @default(cuid()
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)

  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
}
```

### Auto-loading — no imports needed

Prisma merges all `.prisma` files in the folder before compiling. Every model and enum is automatically visible to every other file — just use them directly:

```prisma
// user.prisma — Role is defined in enums.prisma, no import needed
model User {
  role Role @default(USER)
}

// post.prisma — User is defined in user.prisma, no import needed
model Post {
  author User @relation(...)
}
```

> Same concept as Laravel's autoloader — define once anywhere, use everywhere. Prisma only cares that everything is valid when merged together, not which file each piece came from.
>
> **One rule:** each enum or model name must be defined in exactly one file — duplicate names across files will throw an error.

### package.json — set schema folder so all Prisma commands work without flags

```json
"prisma": {
  "schema": "prisma/schema",
  "seed": "ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed.ts"
}
```

Then all commands work normally — no `--schema` flag needed:

```bash
npx prisma migrate dev --name init
npx prisma studio
npx prisma db seed
```

---

## Useful Commands

| Command | What it does |
|---|---|
| `npx prisma generate` | Generates the Prisma Client inside the `app` folder |
| `npx prisma db push` | Pushes your schema to the database (no migration files) |
| `npx prisma studio` | Opens a visual UI to browse and edit your data |
| `npx prisma db push --force-reset` | Drops and recreates all tables (fresh start) |
| `npx prisma migrate dev --name init` | Creates and applies a named migration |
| `npx prisma db seed` | Runs the seed script |

---

## Common Errors

- **Wrong port** — use `5432`, not `6543` for `DATABASE_URL`
- **Special characters in password** — URL-encode them (e.g. `@` → `%40`, `#` → `%23`)

---

## ID Strategies (`@default`)

`cuid()` auto-generates a unique string ID for every new record — similar to Laravel's `uuid()` but a different format.

### Options

| Option | Example output | Notes |
|---|---|---|
| `@default(cuid())` | `clh7qz8x40000356mxyz12abc` | Prisma default, URL-safe, sortable |
| `@default(uuid())` | `550e8400-e29b-41d4-a716-446655440000` | Standard UUID v4, familiar from Laravel |
| `@default(autoincrement())` | `1`, `2`, `3` | Integer IDs, like Laravel's default |

### Which to use

- **`cuid()`** — good default, stick with it if you have no preference
- **`uuid()`** — if you're coming from Laravel and want familiar IDs
- **`autoincrement()`** — only if you need integer IDs (e.g. legacy systems)

### How to switch

```prisma
id String @id @default(uuid())   // UUID
id Int    @id @default(autoincrement())  // Integer
```

---

## Migration Commands — Complete Reference

### New Project (first time setup)

```bash
npx prisma migrate dev --name init
```
- Creates `prisma/migrations/` folder
- Generates first SQL migration file
- Applies it to the DB
- Runs `prisma generate` automatically

---

### Existing Project — Added new column to existing model

```prisma
// post.prisma — added slug column
model Post {
  id    String @id @default(cuid())
  slug  String @unique   // ← new column
  title String
}
```

```bash
npx prisma migrate dev --name add_slug_to_post
```
- Detects the diff from last migration
- Creates a new SQL file for just the new column
- Applies it to DB
- Runs `prisma generate` automatically

---

### Existing Project — Added a brand new `.prisma` file (new model)

```bash
npx prisma migrate dev --name add_category_model
```
Same command — Prisma detects the new model and generates the `CREATE TABLE` SQL for it.

---

### Quick push (dev/prototyping only — no migration files)

```bash
npx prisma db push
```
- Syncs schema directly to DB
- Does **not** create migration files
- Good for early development, **not for production**

---

### Reset everything (drop all tables and re-migrate from scratch)

```bash
npx prisma migrate reset
```
- Drops all tables
- Re-runs all migrations from the beginning
- Runs seed automatically if configured
- **Destructive — never run in production**

---

### Apply migrations in production (no interactive prompts)

```bash
npx prisma migrate deploy
```
- Applies any pending migrations
- Does **not** create new migrations
- Safe for CI/CD and production deployments

---

### Check migration status

```bash
npx prisma migrate status
```
- Shows which migrations have been applied and which are pending

---

### Regenerate Prisma Client after any schema change

```bash
npx prisma generate
```
- Run this if you pushed schema changes manually or pulled a schema update from git
- `migrate dev` runs this automatically, but `db push` does not always

---

### Summary table

| Scenario | Command |
|---|---|
| New project, first migration | `prisma migrate dev --name init` |
| Added column to existing model | `prisma migrate dev --name add_col_to_model` |
| Added new `.prisma` file / model | `prisma migrate dev --name add_model_name` |
| Quick sync without migration files | `prisma db push` |
| Drop all tables and start fresh | `prisma migrate reset` |
| Deploy pending migrations to production | `prisma migrate deploy` |
| Check pending migrations | `prisma migrate status` |
| Refresh Prisma Client types | `prisma generate` |

---

## Seeder Structure (One file per model, like Laravel)

### Folder structure

```
prisma/
├── schema/
│   ├── base.prisma
│   ├── enums.prisma
│   ├── user.prisma
│   ├── post.prisma
│   └── comment.prisma
├── seed/
│   ├── index.ts            ← main entry, calls all seeders in order
│   ├── userSeeder.ts
│   ├── postSeeder.ts
│   └── commentSeeder.ts
```

---

### `prisma/seed/userSeeder.ts`

```ts
import { PrismaClient } from "@prisma/client";

export async function userSeeder(prisma: PrismaClient) {
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: "Alice Admin",
      email: "alice@example.com",
      role: "ADMIN",
    },
  });

  const regular = await prisma.user.create({
    data: {
      name: "Bob User",
      email: "bob@example.com",
      role: "USER",
    },
  });

  console.log(`✅ Users seeded: ${admin.name}, ${regular.name}`);

  return { admin, regular };
}
```

---

### `prisma/seed/postSeeder.ts`

```ts
import { PrismaClient, User } from "@prisma/client";

export async function postSeeder(prisma: PrismaClient, admin: User) {
  await prisma.post.deleteMany();

  const post = await prisma.post.create({
    data: {
      title: "Getting Started with Next.js and Prisma",
      content: "This is a sample post that demonstrates the blog-like architecture.",
      published: true,
      authorId: admin.id,
    },
  });

  console.log(`✅ Posts seeded: "${post.title}"`);

  return { post };
}
```

---

### `prisma/seed/commentSeeder.ts`

```ts
import { PrismaClient, User, Post } from "@prisma/client";

export async function commentSeeder(
  prisma: PrismaClient,
  post: Post,
  admin: User,
  regular: User
) {
  await prisma.comment.deleteMany();

  await prisma.comment.createMany({
    data: [
      {
        content: "Great article! Very clear explanation.",
        postId: post.id,
        authorId: regular.id,
      },
      {
        content: "Thanks for sharing – the repository pattern makes a lot of sense here.",
        postId: post.id,
        authorId: admin.id,
      },
    ],
  });

  console.log(`✅ Comments seeded`);
}
```

---

### `prisma/seed/index.ts`

```ts
import { PrismaClient } from "@prisma/client";
import { userSeeder } from "./userSeeder";
import { postSeeder } from "./postSeeder";
import { commentSeeder } from "./commentSeeder";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database…");

  // Order matters — children after parents
  const { admin, regular } = await userSeeder(prisma);
  const { post } = await postSeeder(prisma, admin);
  await commentSeeder(prisma, post, admin, regular);

  console.log("🎉 Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

### Update `package.json`

```json
"prisma": {
  "schema": "prisma/schema",
  "seed": "ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed/index.ts"
}
```

---

## Complete Schema Reference

### `prisma/schema/base.prisma`

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["prismaSchemaFolder"]
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

---

### `prisma/schema/enums.prisma`

```prisma
enum Role {
  USER
  ADMIN
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

---

### `prisma/schema/user.prisma`

```prisma
model User {
  id        String    @id @default(cuid())
  name      String
  email     String    @unique
  role      Role      @default(USER)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  posts     Post[]
  comments  Comment[]
}
```

---

### `prisma/schema/post.prisma`

```prisma
model Post {
  id        String    @id @default(cuid())
  title     String
  content   String
  published Boolean   @default(false)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  authorId  String
  author    User      @relation(fields: [authorId], references: [id], onDelete: Cascade)

  comments  Comment[]
}
```

---

### `prisma/schema/comment.prisma`

```prisma
model Comment {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)

  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
}
```

---

## Complete `package.json` scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:reset": "prisma migrate reset",
    "db:deploy": "prisma migrate deploy",
    "db:status": "prisma migrate status",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio",
    "db:seed": "prisma db seed"
  },
  "prisma": {
    "schema": "prisma/schema",
    "seed": "ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed/index.ts"
  }
}
```

---

## Complete Project Hierarchy

```
prisma/
│
├── schema/                          ← all .prisma files (multi-file schema)
│   ├── base.prisma                  ← generator + datasource config
│   ├── enums.prisma                 ← all enums (Role, PostStatus, etc.)
│   │
│   ├── user.prisma                  ← User model
│   ├── post.prisma                  ← Post model (belongs to User)
│   └── comment.prisma               ← Comment model (belongs to Post + User)
│
├── seed/                            ← all seeders (one per model)
│   ├── index.ts                     ← main entry, runs all seeders in order
│   ├── userSeeder.ts                ← seeds User table
│   ├── postSeeder.ts                ← seeds Post table
│   └── commentSeeder.ts             ← seeds Comment table
│
└── migrations/                      ← auto-generated by prisma migrate dev
    ├── 20240101000000_init/
    │   └── migration.sql
    └── 20240102000000_add_slug/
        └── migration.sql
```

### Model relationships at a glance

```
User
 ├── has many → Post      (posts[])
 └── has many → Comment   (comments[])

Post
 ├── belongs to → User    (authorId)
 └── has many  → Comment  (comments[])

Comment
 ├── belongs to → Post    (postId)
 └── belongs to → User    (authorId)
```
