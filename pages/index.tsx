import { env } from "process";
import { useSession, signIn, signOut } from "next-auth/react"

export default function Page() {
  const { data: session } = useSession();
  console.log(session);
  return (
    <>
      <button onClick={async () => await signIn('google')}>
        Login
      </button>
      <h1>Hello, Next.js!</h1>
    </>
  );
}