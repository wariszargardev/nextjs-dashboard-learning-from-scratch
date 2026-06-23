export default async function  ShopInfo({params} :{
    params: Promise<{ category: string, productId: number }>
}) {
    const {category, productId} = await params
    return (
        <div>
            <h1>Product Details </h1>
            <p><b>Category: {category}: </b> Product ID: {productId} </p>
        </div>
    )
}