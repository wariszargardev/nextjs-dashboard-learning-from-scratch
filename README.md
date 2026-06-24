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
