import Link from "next/link"

export default function Post(){
    const posts = [
            {
                "id": 1,
                "name": "Alice Smith",
                "email": "alice@example.com",
                "isActive": true
            },
            {
                "id": 2,
                "name": "Bob Jones",
                "email": "bob@example.com",
                "isActive": false
            },
            {
                "id": 3,
                "name": "Charlie Brown",
                "email": "charlie@example.com",
                "isActive": true
            },
            {
                "id": 4,
                "name": "Diana Prince",
                "email": "diana@example.com",
                "isActive": true
            },
            {
                "id": 5,
                "name": "Evan Wright",
                "email": "evan@example.com",
                "isActive": false
            }
        ]

    return (
        <div>
            <h1>Post Page</h1>
            <ul>
                {posts.map(post => (
                    <li key={post.id}> <Link href={'/post/'+ post.id}> {post.name}</Link> </li>
                ))}
            </ul>
        </div>
    )
}