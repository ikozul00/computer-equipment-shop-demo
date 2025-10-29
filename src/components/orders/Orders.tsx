import { OrderType } from "../../types/types"
import { OrderComponent } from "./OrderComponent"
import styles from "./Orders.module.css";

export const Orders = ({ orders }: { orders: OrderType[] }) => {
    return (
        <div className="container">
            <h2>Orders</h2>
            {orders && orders.length > 0 && (
                <div className={styles["orders-container"]}>
                    {orders.map(order => {
                        return <OrderComponent key={order.id} order={order} />
                    })}
                </div>
            )}
        </div>
    )
}
