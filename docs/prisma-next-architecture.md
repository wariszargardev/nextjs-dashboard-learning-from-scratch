# Next.js + Prisma Architecture

**Stack:** Next.js 16 (App Router) · TypeScript · Prisma ORM · PostgreSQL

This project uses a simple MVC-style structure:

- **Model** – `lib/models/*.ts` (plus the Prisma schema) — the shape of the data.
- **Service** – `lib/services/*.ts` — talks to Prisma and holds business logic. This is the *only* place that queries the database.
- **Controller** – `lib/controllers/*.ts` — reads the HTTP request, does basic validation, calls a service function, and shapes the JSON response.
- **Route** – `app/api/**/route.ts` — Next.js requires these files to export `GET`/`POST`/etc. They stay tiny: each one just forwards to the matching controller function. Think of this as the routing table, not where logic lives.

There is no separate "repository" layer — the service talks to Prisma directly, since adding another layer in between just for a thin pass-through added confusion without real benefit at this project's size.

---

## Folder Structure

```
.
├── prisma/
│   ├── schema/                # DB models, enums, relations
│   ├── seed/                  # Dev seed data
│   └── migrations/            # Auto-generated SQL migrations
│
├── lib/
│   ├── db/
│   │   └── prisma.ts          # PrismaClient singleton (the actual DB connection)
│   ├── types/
│   │   └── common.ts          # Shared types: PaginatedResult, PaginationInput, OrderInput
│   ├── models/
│   │   ├── user.ts            # PublicUser, UserListItem, UserFilter
│   │   ├── post.ts            # Post-related types
│   │   └── comment.ts         # Comment-related types
│   ├── controllers/
│   │   └── userController.ts  # Request handling for all /api/users routes
│   └── services/
│       └── userService.ts     # All user DB queries + business logic
│
└── app/
    └── api/
        └── users/
            ├── route.ts        # GET /api/users, POST /api/users → userController
            ├── by-email/
            │   └── route.ts    # GET /api/users/by-email?email=... → userController
            └── [id]/
                └── route.ts    # GET/PATCH/DELETE /api/users/:id → userController
```

---

## Request Flow

```
HTTP request
      │
      ▼
app/api/users/**/route.ts        (Route — forwards to the matching controller function)
      │  calls
      ▼
lib/controllers/userController.ts (Controller — parses request, calls service, shapes response)
      │  calls
      ▼
lib/services/userService.ts      (Service — business rules + Prisma queries)
      │  calls
      ▼
lib/db/prisma.ts                 (PrismaClient singleton)
      │  executes SQL
      ▼
PostgreSQL
```

---

## Layer Responsibilities

| Layer | File pattern | Responsibility |
|---|---|---|
| **Model** | `lib/models/*.ts` | TypeScript shapes returned to callers; filter types |
| **Service** | `lib/services/*.ts` | Business logic + Prisma queries — the only place the DB is touched |
| **Controller** | `lib/controllers/*.ts` | Parse the request, validate input, call the service, return JSON + a status code |
| **Route** | `app/api/**/route.ts` | Wire a URL + HTTP method to its controller function — no logic here |

---

## Key Flows

### User Listing (with search + pagination)

1. `GET /api/users?search=...&page=...` hits `app/api/users/route.ts`, which forwards to `userController.getUsers()`.
2. The controller reads the query params and calls `userService.listUsers({ page, perPage, search, role })`.
3. `listUsers` builds a Prisma `where` clause (`OR [{ name: contains }, { email: contains }]`), then runs `prisma.user.count()` and `prisma.user.findMany()` in parallel.
4. The controller wraps the result in `NextResponse.json(...)`.

### User Create

1. `POST /api/users` forwards to `userController.createUser()`.
2. The controller reads `name`, `email`, `role?` from the request body and validates them.
3. Calls `userService.createUser(input)`, which runs `prisma.user.create(...)`.
4. Responds with `201 Created` + the created user as JSON.

---

## How to Extend (e.g. add Posts)

1. **Model** – add `lib/models/post.ts` (already scaffolded).
2. **Service** – add `lib/services/postService.ts` with the Prisma queries + business logic for posts.
3. **Controller** – add `lib/controllers/postController.ts` with the request-handling functions.
4. **Route** – add `app/api/posts/route.ts` (and `[id]/route.ts`) that just forward to `postController`.

---

## Setup Commands

```bash
# Install deps
npm install

# Set DATABASE_URL in .env (copy .env.example)
cp .env.example .env

# Create tables
npm run db:migrate

# Seed sample data
npm run db:seed

# Run dev server
npm run dev
```
