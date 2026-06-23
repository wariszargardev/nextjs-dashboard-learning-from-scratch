export default async function BlogInfo ({params}: {
    params: Promise<{slug: string}>
}){
    const {slug} = await params
    return (
        <div>
            <h1>Blog Information {slug}</h1>
        </div>
    )
}