# Next.js + Prisma Architecture

**Stack:** Next.js 14 (App Router) · TypeScript · Prisma ORM · PostgreSQL · pnpm

---

## Folder Structure

```
.
├── prisma/
│   ├── schema.prisma          # DB models, enums, relations
│   ├── seed.ts                # Dev seed data
│   └── migrations/            # Auto-generated SQL migrations
│
├── lib/
│   ├── db/
│   │   └── prisma.ts          # PrismaClient singleton
│   ├── types/
│   │   └── common.ts          # PaginatedResult, PaginationInput, OrderInput
│   ├── models/
│   │   ├── user.ts            # PublicUser, UserListItem, UserFilter
│   │   ├── post.ts            # PublicPost, PostWithAuthor, PostFilter
│   │   └── comment.ts         # PublicComment, CommentFilter
│   ├── repositories/
│   │   ├── userRepository.ts  # Prisma queries for User
│   │   └── postRepository.ts  # Prisma queries for Post
│   └── services/
│       ├── userService.ts     # Business logic for users
│       └── postService.ts     # Business logic for posts
│
├── app/
│   ├── api/
│   │   └── users/
│   │       ├── route.ts       # GET /api/users, POST /api/users
│   │       └── [id]/
│   │           └── route.ts   # GET/PATCH/DELETE /api/users/:id
│   └── users/
│       ├── page.tsx           # /users – list + search + pagination
│       └── [id]/
│           └── page.tsx       # /users/:id – user detail
│
└── docs/
    └── prisma-next-architecture.md   # this file
```

---

## Request Flow

```
Browser / Client
      │
      ▼
app/users/page.tsx          (Next.js Server Component)
      │  calls
      ▼
lib/services/userService.ts  (business logic, validation)
      │  calls
      ▼
lib/repositories/userRepository.ts  (Prisma queries, where/orderBy)
      │  calls
      ▼
lib/db/prisma.ts             (PrismaClient singleton)
      │  executes SQL
      ▼
PostgreSQL
```

For API routes the flow is identical, just with a different entry point:

```
HTTP request
      │
      ▼
app/api/users/route.ts       (Next.js Route Handler)
      │
      ▼  (same as above)
```

---

## Layer Responsibilities

| Layer | File pattern | Responsibility |
|---|---|---|
| **Models** | `lib/models/*.ts` | TypeScript shapes returned to callers; filter types |
| **Repository** | `lib/repositories/*.ts` | Raw Prisma queries only; no business rules |
| **Service** | `lib/services/*.ts` | Business logic; calls only repository, never Prisma directly |
| **API Route** | `app/api/**/*.ts` | Parse request, call service, return JSON + status codes |
| **Page** | `app/**/*.tsx` | Server Component; call service, render HTML |

---

## Key Flows

### User Listing (with search + pagination)

1. `app/users/page.tsx` reads `searchParams.page` and `searchParams.search`.
2. Calls `userService.listUsers({ page, perPage, search })`.
3. Service calls `userRepository.list({ filter: { search }, ... })`.
4. Repository builds a Prisma `where` with `OR [{ name: contains }, { email: contains }]`.
5. Runs `prisma.user.count(where)` and `prisma.user.findMany(where, ...)` in parallel.
6. Returns `PaginatedResult<UserListItem>` with `postsCount` from `_count.posts`.
7. Page renders table rows + pagination links.

### User Create

1. `POST /api/users` handler reads `name`, `email`, `role?` from request body.
2. Validates name/email, then calls `userService.createUser(input)`.
3. Service delegates to `userRepository.create(input)`.
4. Prisma inserts the row and returns the created user.
5. Handler responds with `201 Created` + user JSON.

---

## How to Extend (e.g. add Comments)

1. **Model** – add `lib/models/comment.ts` (already done).
2. **Repository** – add `lib/repositories/commentRepository.ts` with `list`, `create`, `delete`.
3. **Service** – add `lib/services/commentService.ts`.
4. **API** – add `app/api/posts/[postId]/comments/route.ts`.
5. **Page** – render comments in `app/posts/[id]/page.tsx`.

---

## Setup Commands

```bash
# Install deps
pnpm install

# Set DATABASE_URL in .env (copy .env.example)
cp .env.example .env

# Create tables
npx prisma migrate dev --name init

# Seed sample data
npx prisma db seed

# Run dev server
pnpm dev
```
