"use client";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { IoSend } from "react-icons/io5";
import Tooltip from "../components/Tooltip";

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
  const [inputValidation, setInputValidation] = useState({
    input1: true,
    input2: true,
    input3: true,
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const input1 = e.target["input-1"].value;
    const input2 = parseInt(e.target["input-2"].value, 10);
    const input3 = e.target["input-3"].value;

    setInputValidation({
      ...inputValidation,
      input1: input1.trim().length > 0,
    });

    setInputValidation({
      ...inputValidation,
      input2: input2 >= 2 && input2 <= 15,
    });

    setInputValidation({
      ...inputValidation,
      input3: input3.trim().length > 0,
    });

    if (inputValidation) {
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
            <h1 className="sign-in-message">Please sign in to use BidBot</h1>
          </div>
        ) : (
          <div className="main-container">
            <form className="input-container" onSubmit={handleSubmit}>
              <div className="input-block">
                <div className="input-block-header">
                  <span>Prompt Basis</span>
                  <Tooltip text='This text forms the basis of the prompt, it sets the guidelines, style and format and asks the LLM to "role play" to answer the question. You may change it from the default to try different approaches.' />
                </div>

                <textarea
                  name="input-1"
                  placeholder="Prompt context"
                  defaultValue={prompt}
                />

                <div className="input-block-header">
                  <span>Context Documents (between 2-10 works best)</span>
                  <Tooltip text="The LLM will only answer based on these documents and these are the documents most similar to your question. So consider changing the question if you want different context documents." />
                </div>
                <input
                  type="number"
                  name="input-2"
                  placeholder="Context Documents (between 2-10 works best)"
                  min={2}
                  max={15}
                  required
                />

                <div className="input-block-header">
                  <span>Prompt Question</span>
                  <Tooltip text="This is the question you wish to create your 100 worder around, this will also determine which context documents the system retrieves." />
                </div>

                <textarea
                  name="input-3"
                  placeholder="Prompt Question"
                  required
                />
                <button className="submit-button" type="submit">
                  <IoSend size={20} />
                </button>
              </div>
            </form>

            <div className="output-container">
              <div className="chat-container">
                <strong>Answer</strong>
                {loading ? (
                  <div className="loading-indicator">
                    <p>Thinking...</p>
                  </div>
                ) : (
                  answer && <p className="answer-container">{answer}</p>
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
          </div>
        )}
      </main>
    </>
  );
}
