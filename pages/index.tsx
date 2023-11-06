"use client";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { IoSend } from "react-icons/io5";

interface DocumentProps {
  Question: string;
  Title: string;
  bodycontentid?: string;
  lastmoddate?: string;
  text: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [prompt, _] = useState(
    "You work for Transform UK. As a smart, commercially aware professional, who is passionate about helping clients and enjoys solving difficult problems, you write in an active voice with empathy and enthusiasm to distil difficult and technical ideas into simple terms. You have been asked to write 100 words to answer the question using only the context below."
  );
  const [answer, setAnswer] = useState("");
  const [documents, setDocuments] = useState<DocumentProps[]>([]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const input1 = e.target["input-1"].value;
    const input2 = parseInt(e.target["input-2"].value, 10);
    const input3 = e.target["input-3"].value;

    try {
      setLoading(true);

      const response = await fetch(`/api/embeddings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input1,
          input2,
          input3,
        }),
      });

      const data = await response.json();
      setAnswer(data.text);
      setDocuments(data.matches);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
            <div className="output-container">
              <div className="chat-container">
                <strong>Answer</strong>
                {loading ? (
                  <div className="loading-indicator">
                    <p>Thinking...</p>
                  </div>
                ) : (
                  <p className="answer-container">{answer}</p>
                )}
              </div>
              <div className="chat-container">
                <strong>Documents used</strong>
                {loading ? (
                  <div className="loading-indicator">
                    <p>Thinking...</p>
                  </div>
                ) : (
                  documents.map((doc, index) => (
                    <div key={index} className="document-answer-container">
                      <h5>{doc.Question}</h5>
                      <p>{doc.Title}</p>
                      <p>{doc.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <form className="input-container" onSubmit={handleSubmit}>
              <div className="input-block">
                <span>Prompt context</span>
                <div className="input-block">
                  <textarea
                    name="input-1"
                    placeholder="Prompt context"
                    defaultValue={prompt}
                  />
                </div>

                <div className="input-block">
                  <span>Amount of documents (between 2-15) for context</span>
                  <input
                    type="number"
                    name="input-2"
                    placeholder="Amount of documents (between 2-15) for context"
                    min={2}
                    max={15}
                    required
                  />
                </div>

                <div className="input-block">
                  <span>Send a message</span>
                  <textarea
                    name="input-3"
                    placeholder="Send a message"
                    required
                  />
                  <button className="submit-button" type="submit">
                    <IoSend size={20} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>
    </>
  );
}
