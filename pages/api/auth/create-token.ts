import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "./[...nextauth]";


export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Methode not allowed" });
    }
    const session: { user: { email: string, id: number } } = await getServerSession(req, res, authOptions);

    if (!session?.user || !session.user.email || !session.user.id) {
        return res.status(401).json({ error: "You must be logged in to view orders" });
    }

    const tokenId = uuidv4();
    const token = {
        email: session.user.email,
        id: tokenId
    }

    localStorage.set(tokenId, JSON.stringify(token));

    setTimeout(() => {
        localStorage.removeItem(tokenId);
    }, 60 * 1000); // expires in 1 min

    res.status(200).json({ token });
}

export function verifyToken(email: string, id: string) {
    const token = JSON.parse(localStorage.getItem(id) || "");
    if (token && token.email == email) {
        localStorage.removeItem(id);
        return email;
    }
    return null;
}
