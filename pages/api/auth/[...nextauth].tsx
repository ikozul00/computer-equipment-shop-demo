import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, profile }) {
            if (!user || !profile || !profile?.email_verified) {
                return false;
            }
            const baseURL = process.env.BASE_URL || "http://localhost:3000";
            const res = await fetch(`${baseURL}/api/users/find?email=${encodeURIComponent(profile.email)}`);
            if (res.ok) {
                const data = await res.json();
                if (data.userId) {
                    return true;
                }
                const userData = await fetch(`${baseURL}/api/users/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: user.name,
                        email: profile.email
                    })
                });
                if (userData.status === 201) {
                    return true;
                }
            }
            return false;
        },
        async jwt({ token, user }) {
            const baseURL = process.env.BASE_URL || "http://localhost:3000";
            if (user && token && !token.userId) {
                const email = (user.email);
                if (email) {
                    const res = await fetch(`${baseURL}/api/users/find?email=${encodeURIComponent(email)}`);
                    if (res.ok) {
                        const user = await res.json();
                        if (user) token.userId = user.userId;
                    }
                }
                return token;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user && token) {
                session.user.id = token.userId;
            }
            return session;
        }
    }
};

export default NextAuth(authOptions);
