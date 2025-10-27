import { useState } from "react";
import { OrderType } from "../../../src/types"
import styles from "./Orders.module.css";
import { Products } from "./Products";

const getStatusStyle = (status: string) => {
    switch (status) {
        case 'pending':
            return styles.pending;
        case 'success':
            return styles.success;
        case 'failed':
            return styles.failed;
        default:
            return '';
    }
}

export const OrderComponent = ({ order }: { order: OrderType }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={styles.order}>
            <div className={styles["order-data"]} onClick={() => setIsOpen(!isOpen)}>
                <div className={styles["order-info"]}>
                    <span>Id: {order.id}</span>
                    <span>{`Total price: ${order.totalPrice}€`}</span>
                    <div className={styles["status-container"]}>
                        <span>Status: </span>
                        <div className={`${styles.status} ${getStatusStyle(order.status)}`}>{order.status}</div>
                    </div>
                </div>
                <button
                    className={`${styles["dropdown-icon"]} ${styles[isOpen ? "rotated-up" : "rotated-down"]}`}
                >
                    {'<'}
                </button>
            </div>
            {isOpen && (
                <Products products={order.products} />
            )}
            {isOpen && <button className={styles["delet-btn"]}>Delete</button>}
        </div>
    )
}