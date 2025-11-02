import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link";
import styles from "./Homepage.module.css";

export const Homepage = () => {
    const { data: session } = useSession();
    const { user } = session || {};

    const handleLogin = async () => {
        if (typeof window !== "undefined" && (window as any).Android) {
            (window as any).Android.openGoogleLogin();
        } else {
            await signIn('google')
        }
    }

    if (user && user.email) {
        return (
            <div className="container">
                <h2>{`Hi ${user.name ?? user.email}, welcome to computer equpiment shop`}</h2>
                <Link className={styles['btn']} href="/orders">View your orders</Link>
            </div>
        )
    }

    return (
        <div className={"container"}>
            <h2>Welcome to computer equpiment shop</h2>
            <button className={styles['btn']} onClick={handleLogin}>
                Login
            </button>
        </div>
    )
}