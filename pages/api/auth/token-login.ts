import type { NextApiRequest, NextApiResponse } from "next";
import { encode } from "next-auth/jwt";
import { serialize } from "cookie";
import prisma from "../../../lib/prisma";

const TOKEN_NAME = "__Secure-next-auth.session-token";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
        return res.status(400).json({ error: "Missing token" });
    }

    const { userId, id } = JSON.parse(token) || {}

    if (!id || !userId) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }

    const tokenData = await prisma.tokens.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            user: true
        }
    });

    if (!tokenData || !tokenData.user || tokenData.user.id !== userId) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }

    const jwtPayload = {
        name: tokenData.user.name,
        email: tokenData.user.email,
        userId: tokenData.user.id,
        sub: tokenData.user.id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + MAX_AGE,
    };

    const tokenPayload = await encode({
        token: jwtPayload,
        secret: process.env.NEXTAUTH_SECRET!,
        maxAge: MAX_AGE,
    });

    const cookie = serialize(TOKEN_NAME, tokenPayload, {
        maxAge: MAX_AGE,
        expires: new Date(Date.now() + MAX_AGE * 1000),
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "lax",
    });

    res.setHeader("Set-Cookie", cookie);
    res.redirect("/orders");
}
