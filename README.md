# Next.js Dashboard — Learning from Scratch

A [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

## Getting Started

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Routing Files

Special filenames that Next.js recognises inside the `app` directory:

| File | Extensions | Purpose |
|------|-----------|---------|
| `layout` | `.js .jsx .tsx` | Shared UI wrapper (persists across navigation) |
| `page` | `.js .jsx .tsx` | Page UI — makes a route public |
| `loading` | `.js .jsx .tsx` | Skeleton / suspense boundary |
| `error` | `.js .jsx .tsx` | Error boundary for a segment |
| `global-error` | `.js .jsx .tsx` | Root-level error boundary |
| `not-found` | `.js .jsx .tsx` | 404 UI |
| `route` | `.js .ts` | API endpoint |
| `template` | `.js .jsx .tsx` | Like a layout, but re-renders on navigation |
| `default` | `.js .jsx .tsx` | Parallel route fallback |

---

## Routing Concepts

### Nested Routes

Folders define URL segments. Nesting folders nests URL segments. A route becomes publicly accessible when a `page` or `route` file exists inside it.

| Path | URL | Notes |
|------|-----|-------|
| `app/layout.tsx` | — | Root layout, wraps everything |
| `app/page.tsx` | `/` | Home page |
| `app/blog/layout.tsx` | — | Wraps `/blog` and all descendants |
| `app/blog/page.tsx` | `/blog` | Blog index |
| `app/blog/authors/page.tsx` | `/blog/authors` | Authors page |

### Dynamic Routes

Parameterise segments with square brackets.

| Path | Matches |
|------|---------|
| `app/blog/[slug]/page.tsx` | `/blog/my-first-post` |
| `app/shop/[...slug]/page.tsx` | `/shop/clothing`, `/shop/clothing/shirts` |
| `app/docs/[[...slug]]/page.tsx` | `/docs`, `/docs/getting-started`, `/docs/api/hooks` |

Access the value via the `params` prop — it is a `Promise` in Next.js 15+:

```tsx
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <h1>{slug}</h1>
}
```

---

## Component Hierarchy

Special files in a segment are rendered in this fixed order (outermost → innermost):

1. `layout.js`
2. `template.js`
3. `error.js` *(error boundary)*
4. `loading.js` *(suspense boundary)*
5. `not-found.js`
6. `page.js` or a nested `layout.js`

In nested routes each segment's component tree wraps inside its parent's.

![Component hierarchy](image.png)
![Nested hierarchy](image-1.png)

---

## Pages and Layouts

### Creating a Page

Add a `page.tsx` inside any folder and default-export a React component.

```tsx
// app/page.tsx
export default function Page() {
  return <h1>Hello Next.js!</h1>
}
```

### Creating a Layout

Default-export a component that accepts a `children` prop. Layouts preserve state and do **not** re-render on navigation.

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
```

### Nesting Layouts

Add a `layout.tsx` inside a route folder to scope it to that segment and its children.

![Nested layouts](image-4.png)

### Creating a Nested Route

A URL like `/blog/my-post` is made of three segments:

- `/` — root segment
- `blog` — segment
- `[slug]` — leaf (dynamic) segment

```
app/
  blog/
    [slug]/
      page.tsx   →  /blog/my-post
```

![Nested route diagram](image-2.png)

```tsx
// app/blog/page.tsx
import { getPosts } from '@/lib/posts'
import { Post } from '@/ui/post'

export default async function Page() {
  const posts = await getPosts()
  return (
    <ul>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </ul>
  )
}
```

![Nested route result](image-3.png)

---

## Search Params

Access query-string values (`?key=value`) via the `searchParams` prop on Server Component pages.

```tsx
// app/page.tsx
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const filters = (await searchParams).filters
}
```

### Using Both `params` and `searchParams`

```tsx
// app/post/[id]/page.tsx
export default async function PostInfo({
  params,
  searchParams,
}: {
  params: Promise<{ id: number }>
  searchParams: Promise<{ name: string; email: string }>
}) {
  const { id } = await params
  const { name, email } = await searchParams

  return (
    <div>
      <p>ID: {id}</p>
      <p>Name: {name}</p>
      <p>Email: {email}</p>
    </div>
  )
}
```

> `searchParams` is only available on **page** components — not layouts.

---

## Linking Between Pages

Use the built-in `<Link>` component for client-side navigation with prefetching.

```tsx
// app/ui/post.tsx
import Link from 'next/link'

export default async function Post({ post }) {
  const posts = await getPosts()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

---

## Route Prop Helpers

Next.js ships utility types that infer `params` and named slots from your route structure.

**`PageProps`** — for page components:

```tsx
// app/blog/[slug]/page.tsx
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  return <h1>Blog post: {slug}</h1>
}
```

**`LayoutProps`** — for layout components:

```tsx
// app/dashboard/layout.tsx
export default function Layout(props: LayoutProps<'/dashboard'>) {
  return (
    <section>
      {props.children}
      {/* Typed parallel-route slot: {props.analytics} */}
    </section>
  )
}
```
