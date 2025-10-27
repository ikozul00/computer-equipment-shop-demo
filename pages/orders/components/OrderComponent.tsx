import { OrderType } from "../../../src/types"

export const OrderComponent = ({ order }: { order: OrderType }) => {
    return <div>
        <span>{order.id}</span>
        <span>Total price: {order.totalPrice}</span>
        <span>Status: {order.status}</span>
        <span>{'<'}</span>
    </div>
}