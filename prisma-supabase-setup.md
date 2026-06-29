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

## Common Errors

- **Wrong port** — use `5432`, not `6543` for `DATABASE_URL`
- **Special characters in password** — URL-encode them (e.g. `@` → `%40`, `#` → `%23`)

| Command | What it does |
|---------|--------------|
| `npx prisma generate` | Generates the Prisma Client inside the `app` folder |
| `npx prisma db push` | Pushes your schema to the database |
| `npx prisma studio` | Opens a visual UI to browse and edit your data |
| `npx prisma db push --force-reset` | Drops and recreates all tables (fresh start) |