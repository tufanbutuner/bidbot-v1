import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { HiOutlineLogout } from "react-icons/hi";
import Logo from "../assets/transform-logo.png";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="navbar-container">
      <div className="navbar-brand">
        <div className="navbar-image">
          <h1>BidBot</h1>
          <p>Powered by</p>
          <Image
            src={Logo}
            height={30}
            width={100}
            objectFit="contain"
            alt="Transform logo"
          />
        </div>
      </div>

      {session && (
        <div className="navbar-footer">
          <p>{session.user?.name}</p>
          <p className="auth-container" onClick={() => signOut()}>
            Sign out
            <HiOutlineLogout />
          </p>
        </div>
      )}
    </div>
  );
}
