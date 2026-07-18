# SELECT Queries

## Select all

Fetches every column for every row in the `User` table.

```ts
const users = await prisma.user.findMany()
```

## Select custom columns only

Fetches every row but only returns the `id`, `name`, and `email` columns.

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

Fetches exactly one row by a unique field (e.g. `id`). Returns `null` if no match is found.

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

Returns the first row that matches the filter, even if the filtered column isn't unique.

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

Returns every row that matches the filter (not just the first one).

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

Listing multiple fields directly inside `where` ANDs them together implicitly — both `name` and `email` must match.

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

Same result as above, but using the explicit `AND` operator with an array of conditions.

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

Returns rows that match at least one of the conditions in the array.

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

Excludes rows matching any of the listed conditions.

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

Combines `OR` and `NOT` in a single query: match either condition in `OR`, but exclude the row with the given `id`.

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

Requires `role: "ADMIN"` (AND) while also requiring the email to contain "john" (OR branch, here with only one condition).

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

Nests `OR` and `AND` inside an outer `AND` array: posts that are either unpublished or start with "w", AND have specific content, AND match a given `id`.

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

Matches rows whose `role` is one of the listed values, and whose `email` is none of the listed values.

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

Filters rows where a nullable column is (or isn't) `null`.

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

Filters rows created within an inclusive date range using `gte`/`lte`.

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

## WHERE — relation filter: some

Returns users who have **at least one** related post that is published.

```ts
const users = await prisma.user.findMany({
    where: {
        posts: {
            some: { published: true }
        }
    }
})
```

## WHERE — relation filter: every

Returns users where **all** of their related posts are published.

```ts
const users = await prisma.user.findMany({
    where: {
        posts: {
            every: { published: true }
        }
    }
})
```

## WHERE — relation filter: none

Returns users who have **no** related posts at all.

```ts
const users = await prisma.user.findMany({
    where: {
        posts: { none: {} },
    },
});
```

## WHERE — filter by a related record's fields

Returns posts whose author has the `ADMIN` role and whose author's `id` is not in the excluded list.

```ts
const posts = await prisma.post.findMany({
    where: {
        author: {
            role: "ADMIN",
            id: {
                notIn: ['cmrc45zmz0003lgnhyiw1d5zl']
            }
        }
    }
})
```

## WHERE — filter across multiple relations

Returns comments whose parent post is published AND whose author has the `ADMIN` role.

```ts
const comments = await prisma.comment.findMany({
    where: {
        post: { published: true },
        author: { role: "ADMIN" },
    },
});
```

## Relations — include related records

Returns comments along with their full related `post` and `author` records.

```ts
const comments = await prisma.comment.findMany({
    include: {
        post: true,
        author: true
    }
})
```

## SELECT — with relations, custom columns

Filters comments by their related post/author, then returns only specific columns from the comment plus specific columns from its `post` and `author` relations (an alternative to `include` when you don't need every column).

```ts
const comments = await prisma.comment.findMany({
    where: {
        post: {
            published: true
        },
        author: {
            role: "ADMIN"
        }
    },
    // include: {
    //     author: true,
    //     post: true
    // }
    select: {
        id: true,
        content: true,
        post: {
            select: {
                id: true,
                title: true,
                content: true
            }
        },
        author: {
            select: {
                id: true,
                name: true,
                email: true
            }
        }
    }
})
```

## Relations — nested include with filtered relation

Returns every user with their published posts, and includes each of those posts' comments.

```ts
const users = await prisma.user.findMany({
    include: {
        posts: {
            where: {
                published: true
            },
            include: {
                comments: true,
            }
        },
    }
})
```

## Relations — nested select with filtered relation

Same idea as above but with `select` instead of `include`, returning only specific columns at every level (user, post, and comment).

```ts
const users = await prisma.user.findMany({
    select: {
        id: true,
        name: true,
        posts: {
            where: {
                published: true,
            },
            select: {
                id: true,
                title: true,
                comments: {
                    select: {
                        id: true,
                        content: true,
                    },
                },
            },
        },
    },
})
```

## ORDER BY and LIMIT

Returns users sorted by `createdAt` descending (newest first), limited to 2 results via `take`.

```ts
const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 2
})
```

## Relations — ordering and limiting nested records

Returns users with their 5 most recent published posts and 5 most recent comments, each nested relation sorted by `createdAt` descending and capped with its own `take`.

```ts
const users = await prisma.user.findMany({
    select: {
        id: true,
        name: true,
        posts: {
            where: {
                published: true
            },
            select: {
                id: true,
                content: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5
        },
        comments: {
            select: {
                id: true,
                content: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5
        }
    }
})
```
