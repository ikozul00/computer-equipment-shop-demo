import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

type ResponseData = {
    message?: string;
    error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method !== "DELETE") {
        return res.status(405);
    }
    const session: { user: { email: string, id: number } } = await getServerSession(req, res, authOptions);

    if (!session?.user || !session.user.email || !session.user.id) {
        return res.status(401);
    }

    const orderIdData = req.query?.orderId?.toString();
    const orderId = orderIdData ? parseInt(orderIdData) : null;
    if (!orderId || Number.isNaN(orderId)) {
        return res.status(400).json({ error: "Invalid order ID" });
    }

    const userId = session.user.id;
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order) {
            return res.status(400).json({ error: "Order not found" });
        }

        if (order.user_id !== userId) {
            return res.status(403).json({ error: "You are not authorized to delete this order" });
        }

        if (order.status !== "pending") {
            return res.status(400).json({ error: "Only pending orders can be deleted" });
        }

        const deleteOrder = await prisma.order.delete({
            where: { id: orderId },
        });

        if (!deleteOrder) {
            return res.status(500).json({ error: "Failed to delete order" });
        }
        return res.status(200).json({ message: "success" });

    } catch (error) {
        return res.status(500).json({ error: "Failed to delete order" });
    }
}