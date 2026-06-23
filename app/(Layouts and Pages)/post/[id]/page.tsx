export default async function PostInfo ({params, searchParams}: {
    params: Promise<{id: number}>,
    searchParams: Promise<{ name: string, email: string }>
}){
    const {id} = await params
    const {name, email} = await searchParams

    return (
        <div>
            <p>ID {id} </p>
            <p>Name {name} </p>
            <p>Email {email} </p>
        </div>
    )
}