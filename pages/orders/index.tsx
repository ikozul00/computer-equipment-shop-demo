import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { OrderType } from "../../src/types/types";
import { Orders } from "../../src/components/orders/Orders";

interface OrdersPageProps {
    orders: OrderType[];
}

const OrdersPage = ({ orders }: OrdersPageProps) => {
    return (
        <Orders orders={orders} />
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions);
    const baseURL = process.env.BASE_URL || "http://localhost:3000";

    if (!session?.user) {
        return {
            redirect: {
                destination: "/", // redirect to homepage
                permanent: false,
            },
        };
    }

    try {
        const res = await fetch(`${baseURL}/api/orders/list`, {
            headers: {
                cookie: ctx.req.headers.cookie ?? "",
            }
        });
        const ordersData = await res.json();
        return { props: { orders: ordersData?.orders ?? [] } };
    } catch (error) {
        return { props: { orders: [] } };
    }

}

export default OrdersPage;