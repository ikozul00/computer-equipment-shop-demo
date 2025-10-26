import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link";

export const Homepage = () => {
    const { data: session } = useSession();
    const { user } = session || {};

    if (user && user.email) {
        return (
            <div>
                <p>{`Hi ${user.name ?? user.email}, welcome to computer equpiment shop`}</p>
                <Link href="/orders">View your orders</Link>
            </div>
        )
    }

    return (
        <div>
            <p>Welcome to computer equpiment shop</p>
            <button onClick={async () => await signIn('google')}>
                Login
            </button>
        </div>
    )
}