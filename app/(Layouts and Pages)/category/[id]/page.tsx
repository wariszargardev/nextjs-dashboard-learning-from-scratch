// app/shop/page.tsx
export default async function PostInfo (props: PageProps<'/category/[id]'>){

    const {id} = await props.params
    const {name, email} = await props.searchParams

    return (
        <div>
            <p>ID {id}</p>
            <p>Name: {name}</p>
            <p>Email: {email} </p>
        </div>
    )
}