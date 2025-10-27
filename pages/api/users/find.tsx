import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

type ResponseData = {
    userId: number | null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    const email = req.query?.email?.toString();
    if (!email) {
        return res.status(400).json({ userId: null });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });
        return res.status(200).json({ userId: user?.id });
    } catch (error) {
        return res.status(400).json({ userId: null });
    }
}