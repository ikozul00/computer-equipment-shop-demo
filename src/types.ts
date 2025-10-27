export type ProductType = {
    id: number,
    name: string,
    price: number,
    image?: string,
    amount: number
}

export type OrderType = {
    id: number,
    status: string,
    totalPrice: number,
    createdAt: string,
    updatedAt: string | null,
    products: ProductType[];
}