export type ProductType = {
    id: number,
    name: string,
    price: number,
    image?: string,
    quantity: number,
    amount: number
}

export type OrderType = {
    id: number,
    status: "success" | "pending" | "failed",
    totalPrice: number,
    createdAt: string,
    updatedAt: string | null,
    products: ProductType[];
}