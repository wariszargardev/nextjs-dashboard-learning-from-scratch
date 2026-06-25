# Next.js Dashboard — Learning from Scratch

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## Table of Contents

- [Chapter 1 — Project Structure](#chapter-1--project-structure)
- [Chapter 2 — CSS Styling](#chapter-2--css-styling)
- [Chapter 3 — Optimizing Fonts & Images](#chapter-3--optimizing-fonts--images)
- [Chapter 4 — Creating Layouts and Pages](#chapter-4--creating-layouts-and-pages)

---

## Chapter 1 — Project Structure

### Folder Layout

![Folder structure](image.png)

| Path | Description |
|------|-------------|
| `/app` | All routes, components, and logic — this is where you'll work most |
| `/app/lib` | Reusable utility functions and data-fetching functions |
| `/app/ui` | UI components (cards, tables, forms) — pre-styled to save time |
| `/public` | Static assets such as images |
| `next.config.ts` | Root config file, created and pre-configured by `create-next-app` |

### Placeholder Data

Placeholder data lives in [`app/lib/placeholder-data.ts`](app/lib/placeholder-data.ts). Each JavaScript object represents a database table. For example, the invoices table:

```ts
const invoices = [
  {
    customer_id: customers[0].id,
    amount: 15795,
    status: 'pending',
    date: '2022-12-06',
  },
  {
    customer_id: customers[1].id,
    amount: 20348,
    status: 'pending',
    date: '2022-11-14',
  },
  // ...
];
```

### TypeScript

Most files use a `.ts` or `.tsx` extension — the project is written in TypeScript to reflect the modern web landscape.

Type definitions live in [`app/lib/definitions.ts`](app/lib/definitions.ts). For example:

```ts
export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // String union type — status can only be 'pending' or 'paid'
  status: 'pending' | 'paid';
};
```

TypeScript prevents accidentally passing the wrong data format — for example, a `string` where `amount` expects a `number`.

---

## Chapter 2 — CSS Styling

### Global Styles

Inside [`/app/ui/global.css`](app/ui/global.css) you can add CSS rules that apply to all routes — CSS resets, site-wide element styles, and more.

Import it once at the top-level component. In Next.js that is the root layout:

```ts
// app/layout.tsx
import '@/app/ui/global.css';
```

### Tailwind

Tailwind is a utility-first CSS framework that lets you style directly in JSX:

```tsx
<h1 className="text-blue-500">I'm blue!</h1>
```

### CSS Modules

CSS Modules scope styles to a single component by auto-generating unique class names, eliminating style collisions.

To try it, create `/app/ui/home.module.css` and import it in the component where you need it. Both approaches (Tailwind and CSS Modules) produce the same result — this course continues with Tailwind.

---

## Chapter 3 — Optimizing Fonts & Images

### Why Optimize Fonts?

Custom fonts can hurt performance if fetched at runtime. Next.js solves this with the `next/font` module — it downloads font files at **build time** and hosts them alongside your static assets, so there are zero extra network requests when a user visits the app.

### Why Optimize Images?

Next.js serves static assets from the top-level `/public` folder. A plain `<img>` tag works, but has no built-in optimizations:

```html
<img
  src="/hero.png"
  alt="Screenshots of the dashboard project showing desktop version"
/>
```

### The `<Image>` Component

`<Image>` extends the native `<img>` tag with automatic optimizations:

- Prevents layout shift while images load
- Resizes images to match the device viewport
- Lazy-loads images by default (loads when entering the viewport)
- Serves modern formats (WebP, AVIF) when the browser supports them

---

## Chapter 4 — Creating Layouts and Pages

### Nested Routing

Next.js uses **file-system routing** — folders map directly to URL segments.

![Nested routing diagram](image-1.png)

Each route can have its own `layout.tsx` and `page.tsx`:

![Layout and page files](image-2.png)

**Partial rendering** means only the `page.tsx` re-renders on navigation — the shared `layout.tsx` stays mounted, preserving client-side React state.

![Partial rendering diagram](image-3.png)

Chapter 5

Navigating Between Pages
In the previous chapter, you created the dashboard layout and pages. Now, let's add some links to allow users to navigate between the dashboard routes.

To link between pages, you'd traditionally use the <a> HTML element. At the moment, the sidebar links use <a> elements, but notice what happens when you navigate between the home, invoices, and customers pages on your browser.

Did you see it?

There's a full page refresh on each page navigation!

The <Link> component

In Next.js, you can use the <Link /> Component to link between pages in your application. <Link> allows you to do client-side navigation with JavaScript.

To use the <Link /> component, open /app/ui/dashboard/nav-links.tsx, and import the Link component from next/link. Then, replace the <a> tag with <Link>:

Pattern: Showing active links
A common UI pattern is to show an active link to indicate to the user what page they are currently on. To do this, you need to get the user's current path from the URL. Next.js provides a hook called usePathname() that you can use to check the path and implement this pattern.

Since usePathname() is a React hook, you'll need to turn nav-links.tsx into a Client Component. Add React's "use client" directive to the top of the file, then import usePathname() from next/navigation:

