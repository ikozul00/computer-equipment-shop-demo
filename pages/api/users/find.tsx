import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

type ResponseData = {
    exists: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    const email = req.query?.email?.toString();
    if (!email) {
        return res.status(400).json({ exists: false });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });
        return res.status(200).json({ exists: !!user });
    } catch (error) {
        return res.status(400).json({ exists: false });
    }
}