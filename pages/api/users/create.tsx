import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

type ResponseData = {
    userId: number | null;
}

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
        res.status(201).json({ userId: user.id });
    } catch (error) {
        res.status(500).json({ userId: null });
    }
}