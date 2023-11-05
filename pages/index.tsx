"use client";
import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [history, setHistory] = useState([
    {
      role: "assistant",
      content: "Welcome, ask me any questions about Transform",
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <Head>
        <title>BidBot</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main className="container">
        <div className="main-container">
          <div className="input-container">
            <div className="input-block">
              <div className="input-block">
                <strong>Prompt context</strong>
                <input name="myInput" />
              </div>

              <div className="input-block">
                <strong>
                  Choose the amount of documents (between 2-15) for context
                </strong>
                <input type="text" name="input-2" />
              </div>

              <div className="input-block">
                <strong>Ask a question</strong>
                <textarea name="input-3" />
              </div>
            </div>

            <button>Shiny Do Stuff Button</button>
          </div>

          <div className="output-container">
            <div className="chat-container">
              <strong>Documents used</strong>
            </div>
            <div className="chat-container">
              <strong>Answer</strong>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
