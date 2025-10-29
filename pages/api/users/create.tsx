import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

type ResponseData = {
    userId: number | null;
}

const createOrders = (userId) => ([
    {
        data: {
            user: { connect: { id: userId } },
            status: "pending",
            orderList: {
                create: [
                    { quantity: 3, product: { connect: { id: 2 } } },
                    { quantity: 2, product: { connect: { id: 3 } } },
                ],
            },
        },
        include: {
            orderList: { include: { product: true } },
            user: true,
        },
    },
    {
        data: {
            user: { connect: { id: userId } },
            status: "pending",
            orderList: {
                create: [
                    { quantity: 1, product: { connect: { id: 1 } } },
                    { quantity: 2, product: { connect: { id: 3 } } },
                ],
            },
        },
        include: {
            orderList: { include: { product: true } },
            user: true,
        },
    },
    {
        data: {
            user: { connect: { id: userId } },
            status: "success",
            orderList: {
                create: [
                    { quantity: 1, product: { connect: { id: 1 } } },
                ],
            },
        },
        include: {
            orderList: { include: { product: true } },
            user: true,
        },
    },
    {
        data: {
            user: { connect: { id: userId } },
            status: "pending",
            orderList: {
                create: [
                    { quantity: 2, product: { connect: { id: 2 } } },
                    { quantity: 2, product: { connect: { id: 3 } } },
                ],
            },
        },
        include: {
            orderList: { include: { product: true } },
            user: true,
        },
    },
    {
        data: {
            user: { connect: { id: userId } },
            status: "failed",
            orderList: {
                create: [
                    { quantity: 1, product: { connect: { id: 4 } } },
                    { quantity: 2, product: { connect: { id: 2 } } },
                ],
            },
        },
        include: {
            orderList: { include: { product: true } },
            user: true,
        },
    },
    {
        data: {
            user: { connect: { id: userId } },
            status: "pending",
            orderList: {
                create: [
                    { quantity: 1, product: { connect: { id: 4 } } },
                    { quantity: 2, product: { connect: { id: 2 } } },
                    { quantity: 4, product: { connect: { id: 3 } } },
                ],
            },
        },
        include: {
            orderList: { include: { product: true } },
            user: true,
        },
    }
]);

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    if (req.method !== "POST") {
        return res.status(405);
    }
    const email = req.body?.email?.toString() ?? "";
    const name = req.body?.name?.toString() ?? "";
    if (!email) {
        return res.status(400).json({ userId: null });
    }

    try {
        const user = await prisma.user.create({
            data: {
                name: name,
                email: email.toLowerCase()
            }
        })
        if (user) {
            createOrders(user.id).forEach(async (order) => {
                await prisma.order.create(order);
            });
        }

        res.status(201).json({ userId: user.id });
    } catch (error) {
        res.status(500).json({ userId: null });
    }
}