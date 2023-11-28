"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import DocumentDisplay from "../components/DocumentDisplay";
import InputForm from "../components/InputForm";
import useFormSubmit from "../hooks/useFormSubmit";

interface DocumentMetadata {
  Question: string;
  Title: string;
  bodycontentid: string;
  lastmoddate: string;
  text: string;
}
interface DocumentProps {
  score: number[];
  metadata: DocumentMetadata[];
  tokens: string[] | string;
}

export default function Home() {
  const { data: session } = useSession();
  const { handleSubmit, loading, error, responseData, disableButton } =
    useFormSubmit();
  const [answer, setAnswer] = useState({
    text: "",
    wordCount: 0,
    characterCount: 0,
    tokenAmount: 0,
  });
  const [documents, setDocuments] = useState<DocumentProps>({
    score: [0],
    metadata: [],
    tokens: "",
  });

  const onFormSubmit = async (formData: any) => {
    await handleSubmit(formData);

    if (responseData == null) {
      setAnswer({
        text: "",
        wordCount: 0,
        characterCount: 0,
        tokenAmount: 0,
      });

      setDocuments({
        score: [0],
        metadata: [],
        tokens: "",
      });
    }

    if (responseData) {
      setAnswer({
        text: responseData.text,
        wordCount: responseData.wordCount,
        characterCount: responseData.charCount,
        tokenAmount: responseData.tokenAmount,
      });

      setDocuments({
        score: responseData.matches.map((match) => match.score),
        metadata: responseData.matches.map((match) => match.metadata),
        tokens: responseData.matches.flatMap((match) =>
          Array.isArray(match.tokens) ? match.tokens : [match.tokens]
        ),
      });
    }
  };

  console.log(answer);
  console.log(documents);

  return (
    <>
      <main className="container">
        {!session ? (
          <div className="sign-in-message-container">
            <h1 className="sign-in-message">Please sign in to use BidBot</h1>
          </div>
        ) : (
          <div className="main-container">
            <InputForm onSubmit={onFormSubmit} disabled={disableButton} />
            {error && <p className="error-message">{error}</p>}
            <DocumentDisplay
              documents={documents}
              answer={answer}
              loading={loading}
            />
          </div>
        )}
      </main>
    </>
  );
}
