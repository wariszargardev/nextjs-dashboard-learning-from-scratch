export default async function PostInfo ({params}: {
    params: Promise<{id: number}>
}){
    const {id} = await params

    return (
        <div>
            Record ID {id}
        </div>
    )
}