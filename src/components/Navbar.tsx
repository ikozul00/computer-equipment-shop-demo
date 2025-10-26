import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export const Navbar = () => {
    const { data: session } = useSession();
    return (
        <div>
            <Link href="/">Home</Link>
            {session && session.user && (
                <>
                    <Link href="/orders">Orders</Link>
                    <button onClick={() => signOut()}>Log out</button>
                </>
            )}
        </div>
    );
}