import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import styles from "./Navbar.module.css";

export const Navbar = () => {
    const { data: session } = useSession();
    return (
        <div className={styles.container}>
            <div className={styles["links-container"]}>
                <Link className={styles.link} href="/">Home</Link>
                {session?.user && (
                    <>
                        <Link className={styles.link} href="/orders">Orders</Link>
                    </>
                )}
            </div>
            {session?.user ? (
                <div className={`${styles["user-link"]} ${styles.link}`} onClick={() => signOut()}>Log out</div>
            ) : (
                <div className={`${styles["user-link"]} ${styles.link}`} onClick={() => signIn()}>Login</div>
            )}
        </div>
    );
}