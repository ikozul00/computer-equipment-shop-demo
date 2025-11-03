import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "./[...nextauth]";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
    console.log("Prisma models:", Object.keys(prisma));
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Methode not allowed" });
    }
    const session: { user: { email: string, id: number } } = await getServerSession(req, res, authOptions);
    if (!session?.user || !session.user.id) {
        return res.status(401).json({ error: "You must be logged in to view orders" });
    }

    const tokenId = uuidv4();

    try {
        const tokenData = await prisma.tokens.create({
            data: {
                id: tokenId,
                user_id: session.user.id
            }
        });

        res.status(200).json({ token: { userId: session.user.id, id: tokenId } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Can't create token" });
    }
}
