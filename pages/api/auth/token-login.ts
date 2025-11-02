import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "./create-token";
import { encode } from "next-auth/jwt";
import { serialize } from "cookie";

const TOKEN_NAME = "__Secure-next-auth.session-token";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
        return res.status(400).json({ error: "Missing token" });
    }

    const { email, id } = JSON.parse(token) || {};
    if (!email || !id || !verifyToken(email, id)) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Fetch user from DB or create new user
    const baseURL = process.env.BASE_URL || "http://localhost:3000";
    const userRes = await fetch(`${baseURL}/api/users/find?email=${encodeURIComponent(email)}`);
    let user = null;
    if (userRes.ok) {
        const userData = await userRes.json();
        if (userData.userId) {
            const jwtPayload = {
                name: userData.name,
                email: userData.email,
                sub: userData.userId,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + MAX_AGE,
            };

            const token = await encode({
                token: jwtPayload,
                secret: process.env.NEXTAUTH_SECRET!,
                maxAge: MAX_AGE,
            });
            const cookie = serialize(TOKEN_NAME, token, {
                maxAge: MAX_AGE,
                expires: new Date(Date.now() + MAX_AGE * 1000),
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                sameSite: "lax",
            });

            res.setHeader("Set-Cookie", cookie);
            res.redirect("/orders");
        }
    }

    res.redirect("/");
}
