"use client";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";

interface DocumentProps {
  Question: string;
  Title: string;
  bodycontentid?: string;
  lastmoddate?: string;
  text: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [answer, setAnswer] = useState("");
  const [documents, setDocuments] = useState<DocumentProps[]>([]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // const input1 = e.target["input-1"].value;
    const input2 = e.target["input-2"].value;
    const input3 = e.target["input-3"].value;

    try {
      const response = await fetch("http://localhost:3000/api/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input2,
          input3,
        }),
      });

      const data = await response.json();
      setAnswer(data.text);
      setDocuments(data.matches);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  console.log(documents);

  return (
    <>
      <Head>
        <title>BidBot</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="container">
        {!session ? (
          <div className="sign-in-message-container">
            <h1 className="sign-in-message">Please sign in to use BidBot.</h1>
          </div>
        ) : (
          <div className="main-container">
            <form className="input-container" onSubmit={handleSubmit}>
              <div className="input-block">
                <div className="input-block">
                  <strong>Prompt context</strong>
                  <input type="text" name="input-1" />
                </div>

                <div className="input-block">
                  <strong>
                    Choose the amount of documents (between 2-15) for context
                  </strong>
                  <input type="number" name="input-2" required />
                </div>

                <div className="input-block">
                  <strong>Ask a question</strong>
                  <textarea name="input-3" required />
                </div>
                <button type="submit">Shiny Do Stuff Button</button>
              </div>
            </form>

            <div className="output-container">
              <div className="chat-container">
                <strong>Documents used</strong>
                {documents.map((doc, index) => (
                  <div key={index}>
                    <h5>{doc.Question}</h5>
                    <p>{doc.Title}</p>
                    <p>{doc.text}</p>
                  </div>
                ))}
              </div>
              <div className="chat-container">
                <strong>Answer</strong>
                <p>{answer}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
