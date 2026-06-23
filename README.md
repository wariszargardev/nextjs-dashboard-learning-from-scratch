This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Routing Files
Add page to expose a route, layout for shared UI such as header, nav, or footer, loading for skeletons, error for error boundaries, and route for APIs.

layout	.js .jsx .tsx	Layout
page	.js .jsx .tsx	Page
loading	.js .jsx .tsx	Loading UI
not-found	.js .jsx .tsx	Not found UI
error	.js .jsx .tsx	Error UI
global-error	.js .jsx .tsx	Global error UI
route	.js .ts	API endpoint
template	.js .jsx .tsx	Re-rendered layout
default	.js .jsx .tsx	Parallel route fallback page

Nested routes
Folders define URL segments. Nesting folders nests segments. Layouts at any level wrap their child segments. A route becomes public when a page or route file exists.

Path	URL pattern	Notes
app/layout.tsx	—	Root layout wraps all routes
app/blog/layout.tsx	—	Wraps /blog and descendants
app/page.tsx	/	Public route
app/blog/page.tsx	/blog	Public route
app/blog/authors/page.tsx	/blog/authors	Public route

Dynamic routes
Parameterize segments with square brackets. Use [segment] for a single param, [...segment] for catch‑all, and [[...segment]] for optional catch‑all. Access values via the params prop.

Path	URL pattern
app/blog/[slug]/page.tsx	/blog/my-first-post
app/shop/[...slug]/page.tsx	/shop/clothing, /shop/clothing/shirts
app/docs/[[...slug]]/page.tsx	/docs, /docs/layouts-and-pages, /docs/api-reference/use-router