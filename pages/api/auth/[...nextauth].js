import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, profile }) {
            if (!user || !profile || !profile.email_verified) {
                return false;
            }
            const baseURl = process.env.BASE_URL || "http://localhost:3000";
            const res = await fetch(`${baseURl}/api/users/find?email=${encodeURIComponent(profile.email)}`);
            if (res.ok) {
                const data = await res.json();
                if (data.exists) {
                    return true;
                }
                const userData = await fetch(`${baseURl}/api/users/create`, {
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
        }
    }
});
