import Link from "next/link"

export default async function Category(props: PageProps<"/category">){
    const {name} = await props.searchParams

    const categories = [
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
            <h1>Category Page - Name: {name}</h1>
            <ul>
                {categories.map(categoty => (
                    <li key={categoty.id}> <Link href={`category/${categoty.id}?name=${categoty.name}&email=${categoty.email}`}> {categoty.name}</Link> </li>
                ))}
            </ul>
        </div>
    )
}