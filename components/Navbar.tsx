import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Logo from "../assets/transform-logo.png";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="navbar-container">
      <div className="navbar-brand">
        <h1>BidBot</h1>
        <p>Powered by</p>
        <Image
          src={Logo}
          height={50}
          objectFit="contain"
          alt="Transform UK logo"
        />
      </div>

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
