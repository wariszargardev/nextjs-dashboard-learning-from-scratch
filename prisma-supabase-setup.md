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
