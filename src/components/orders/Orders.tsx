import { useEffect, useState } from "react";
import { OrderType } from "../../types/types"
import { OrderComponent } from "./OrderComponent"
import styles from "./Orders.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const Orders = () => {
    const { data: session, status } = useSession();
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/orders/list`);
            const data = await res.json();
            if (!res.ok) {
                setError(data.error);
            }

            if (data?.orders && data.orders.length > 0) {
                setOrders(data?.orders);
                localStorage.setItem(`orders_${session.user.id}`, JSON.stringify({ orders: data?.orders, lastUpdated: new Date() }));
            }
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setError("Failed to load orders");
        }
    }

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }

        if (!session?.user?.id) {
            return;
        }

        if (!navigator.onLine) {
            const data = localStorage.getItem(`orders_${session.user.id}`);
            if (data) {
                const ordersData = JSON.parse(data);
                setOrders(ordersData?.orders);
            }
        } else {
            fetchOrders();
        }

        const handleOnline = () => {
            fetchOrders();
        }

        window.addEventListener("online", handleOnline);
        return () => window.removeEventListener("online", handleOnline);
    }, [session?.user, status])

    return (
        <div className="container">
            <h2>Orders</h2>
            {isLoading && <p>Loading ...</p>}
            {error && <p>Error: {error}</p>}
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
