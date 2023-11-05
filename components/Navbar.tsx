import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="navbar-container">
      <h1>BidBot</h1>
      <ul>
        {session ? (
          <>
            <li>{session.user?.name}</li>
            <li onClick={() => signOut()}>Sign out</li>
          </>
        ) : (
          <li onClick={() => signIn()}>Sign in</li>
        )}
      </ul>
    </div>
  );
}
