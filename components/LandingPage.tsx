import { signIn } from "next-auth/react";
import Image from "next/image";
import StockImage from "../assets/image.webp";
import Logo from "../assets/transform-logo.png";

export default function LandingPage() {
  return (
    <div className="sign-in-message-container">
      <div className="title-column">
        <h1 className="bidbot-title">BidBot</h1>

        <a className="sign-in-button" onClick={() => signIn()}>
          Get started
        </a>

        <div>
          <p>Powered by</p>
          <Image
            src={Logo}
            width={200}
            height="60%"
            alt="Transform Logo"
            objectFit="contain"
          />
        </div>
      </div>
      <div className="image-column">
        <Image
          src={StockImage}
          alt=""
          width="0"
          height="0"
          // sizes="100vw"
          objectFit="cover"
          layout="fill"
          priority
        />
      </div>
    </div>
  );
}
