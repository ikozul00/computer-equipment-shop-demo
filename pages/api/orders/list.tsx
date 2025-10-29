import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";
import { OrderType, ProductType } from "../../../src/types/types";

type ResponseData = {
    orders?: OrderType[];
    error?: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method !== "GET") {
        return res.status(405);
    }
    const session: { user: { email: string, id: number } } = await getServerSession(req, res, authOptions);

    if (!session?.user || !session.user.email || !session.user.id) {
        return res.status(401).json({ orders: [] });
    }

    const userId = session.user.id;
    try {
        const ordersData = await prisma.order.findMany({
            where: { user_id: userId },
            include: {
                orderList: {
                    select: {
                        quantity: true,
                        product: true
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        const orders: OrderType[] = ordersData.map(order => {
            let totalPrice = 0;
            const products: ProductType[] = order.orderList.map(item => {
                totalPrice += item.product.price * item.quantity;
                return {
                    quantity: item.quantity,
                    ...item.product,
                }
            });
            return {
                id: order.id,
                status: order.status,
                updatedAt: order.updatedAt,
                createdAt: order.createdAt,
                products,
                totalPrice
            }
        });
        return res.status(200).json({ orders });
    } catch (error) {
        return res.status(500).json({ error });
    }
}