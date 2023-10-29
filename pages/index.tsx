import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home({ data }: { data: { time: string } }) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    fetch("/api/time")
      .then((res) => res.json())
      .then((json) => setTime(new Date(json.time)));
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>BidBot</title>
        <meta name="description" content="BidBot created by Transform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to BidBot</h1>
        <p>
          {time &&
            `The time is ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`}
        </p>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}

export async function getServerSideProps() {
  const data = JSON.stringify({ time: new Date().toString() });
  return { props: { data } };
}
