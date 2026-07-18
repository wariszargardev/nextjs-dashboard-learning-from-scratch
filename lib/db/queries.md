# SELECT Queries

## Select all

```ts
const users = await prisma.user.findMany()
```

## Select custom columns only

```ts
const users = await prisma.user.findMany({
    select: {
        id: true,
        name: true,
        email: true
    }
})
```

## Single unique record (must query by a unique column)

```ts
const user = await prisma.user.findUnique({
    where: { id: "cmrm41op40000vgnhbnq5g0gf" },
})
```

With select:

```ts
const user = await prisma.user.findUnique({
    where: { id: "cmrm41op40000vgnhbnq5g0gf" },
    select: {
        id: true,
        name: true,
        email: true
    }
})
```

## Find first matching value

```ts
const user = await prisma.user.findFirst({
    where: { name: "Liva INSURANCE" },
    select: {
        id: true,
        name: true,
        email: true
    }
})
```

## Find many matching values

```ts
const users = await prisma.user.findMany({
    where: { name: "Liva INSURANCE" },
    select: {
        id: true,
        name: true,
        email: true
    }
})
```

## AND condition (implicit)

```ts
const users = await prisma.user.findMany({
    where: {
        name: "Liva INSURANCE",
        email: "muhammad.wari3s@myalfred.com"
    },
    select: {
        id: true,
        name: true,
        email: true
    }
})
```

## AND condition (explicit)

```ts
export default async function Queries() {
    const users = await prisma.user.findMany({
        where: {
            AND: [
                { name: "Liva INSURANCE" },
                { email: "muhammad.wari3s@myalfred.com" }
            ]
        },
        select: {
            id: true,
            name: true,
            email: true
        }
    })
}
```

## OR condition

```ts
const users = await prisma.user.findMany({
    where: {
        OR: [
            { name: "Liva INSURANCE" },
            { email: "muhammad.wari3s@myalfred.com" }
        ]
    },
    select: {
        id: true,
        name: true,
        email: true
    }
})
```

## WHERE — NOT condition

```ts
const users = await prisma.user.findMany({
    where: {
        NOT: [
            { name: "Liva INSURANCE" },
            { email: "muhammad.wari3s@myalfred.com" }
        ]
    },
    select: {
        id: true,
        name: true,
        email: true
    }
})
```

## Multiple conditions combined

```ts
const users = await prisma.user.findMany({
    where: {
        OR: [
            { name: "Liva INSURANCE" },
            { email: "muhammad.wari3s@myalfred.com" }
        ],
        NOT: [
            { id: "cmrc45zmz0003lgnhyiw1d5zl" }
        ]
    }
})
```

## WHERE — AND + OR combined

```ts
const users = await prisma.user.findMany({
    where: {
        AND: [
            { role: "ADMIN" },
        ],
        OR: [
            {
                email: {
                    contains: "john"
                }
            }
        ]
    }
})
```

## Complex query

```ts
const posts = await prisma.post.findMany({
    where: {
        AND: [
            {
                OR: [
                    { published: false },
                    { title: { startsWith: 'w' } }
                ],
                AND: {
                    content: "dsgfsdgfdsg"
                }
            },
            { id: "cmrc46mpo0006lgnhw2qaze0c" }
        ],
    },
})
```

## IN and NOT IN

```ts
const users = await prisma.user.findMany({
    where: {
        role: {
            in: ['ADMIN', "USER"]
        },
        email: {
            notIn: ['muhammad.wari3s@myalfred.com', 'john21@example.com']
        }
    },
    select: {
        id: true,
        name: true,
        email: true,
        role: true,
    }
})
```

## WHERE — null check

```ts
// IS NULL
const users = await prisma.user.findMany({
    where: { deletedAt: null },
});

// IS NOT NULL
const users = await prisma.user.findMany({
    where: {
        deletedAt: { not: null },
    },
});
```

## WHERE — date range (BETWEEN)

```ts
const users = await prisma.user.findMany({
    where: {
        createdAt: {
            gte: new Date("2024-01-01"), // greater than or equal
            lte: new Date("2024-12-31"), // less than or equal
        },
    },
});
```
