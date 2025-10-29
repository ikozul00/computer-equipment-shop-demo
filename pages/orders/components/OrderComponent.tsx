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
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onDeleteOrder = async () => {
        const data = await fetch(`/api/orders/delete?orderId=${order.id}`, {
            method: "DELETE",
        });
        if (data.ok) {
            window.location.reload();
        } else {
            const errorData = await data.json();
            setErrorMessage(errorData.error || "Failed to delete order");
        }
    }

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
            {isOpen && errorMessage && (
                <p>{errorMessage}</p>
            )}
            {isOpen && order.status === "pending" && (
                <button className={styles["delete-btn"]} onClick={onDeleteOrder}>Delete</button>
            )}
        </div>
    )
}