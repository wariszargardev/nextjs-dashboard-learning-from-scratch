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
Chapter 1
## Folder Structure

![Folder structure](image.png)

| Path | Description |
|------|-------------|
| `/app` | All routes, components, and logic — this is where you'll work most |
| `/app/lib` | Reusable utility functions and data-fetching functions |
| `/app/ui` | UI components (cards, tables, forms) — pre-styled to save time |
| `/public` | Static assets such as images |
| `next.config.ts` | Config files at the root, created and pre-configured by `create-next-app` |

---

## Placeholder Data

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

---

## TypeScript

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


Chapter 2

CSS Styling

Global styles

If you look inside the /app/ui folder, you'll see a file called global.css. You can use this file to add CSS rules to all the routes in your application - such as CSS reset rules, site-wide styles for HTML elements like links, and more.

You can import global.css in any component in your application, but it's usually good practice to add it to your top-level component. In Next.js, this is the root layout (more on this later).

/app/layout.tsx

import '@/app/ui/global.css';

Tailwind
Tailwind is a CSS framework that speeds up the development process by allowing you to quickly write utility classes directly in your React code.

<h1 className="text-blue-500">I'm blue!</h1>

CSS Modules
CSS Modules allow you to scope CSS to a component by automatically creating unique class names, so you don't have to worry about style collisions as well.

We'll continue using Tailwind in this course, but let's take a moment to see how you can achieve the same results from the quiz above using CSS modules.
Inside /app/ui, create a new file called home.module.css and add the following CSS rules:



Chapter 3

Optimizing Fonts and Images

Why optimize fonts?

Fonts play a significant role in the design of a website, but using custom fonts in your project can affect performance if the font files need to be fetched and loaded.

Next.js automatically optimizes fonts in the application when you use the next/font module. It downloads font files at build time and hosts them with your other static assets. This means when a user visits your application, there are no additional network requests for fonts which would impact performance.

Why optimize images?

Next.js can serve static assets, like images, under the top-level /public folder. Files inside /public can be referenced in your application.

With regular HTML, you would add an image as follows:

<img
  src="/hero.png"
  alt="Screenshots of the dashboard project showing desktop version"
/>

The <Image> component
The <Image> Component is an extension of the HTML <img> tag, and comes with automatic image optimization, such as:

Preventing layout shift automatically when images are loading.
Resizing images to avoid shipping large images to devices with a smaller viewport.
Lazy loading images by default (images load as they enter the viewport).
Serving images in modern formats, like WebP and AVIF, when the browser supports it.

Nested routing
Next.js uses file-system routing where folders are used to create nested routes. Each folder represents a route segment that maps to a URL segment.

![alt text](image-1.png)

You can create separate UIs for each route using layout.tsx and page.tsx files.

![alt text](image-2.png)