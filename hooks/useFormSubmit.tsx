// useFormSubmit.js
import { useState } from "react";

interface DocumentMetadata {
  Question: string;
  Title: string;
  bodycontentid: string;
  lastmoddate: string;
  text: string;
}

interface ApiResponse {
  text: string;
  wordCount: number;
  charCount: number;
  tokenAmount: number;
  matches: Array<{
    score: number;
    metadata: DocumentMetadata;
    tokens: string[] | string;
  }>;
}

export default function useFormSubmit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [responseData, setResponseData] = useState<ApiResponse | null>(null);

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    setError("");
    setResponseData(null);
    setDisableButton(true);

    try {
      const response = await fetch("/api/embeddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input1: formData.input1,
          input2: formData.input2,
          input3: formData.input3,
          wordsToInclude: formData.wordsToInclude,
          wordsToExclude: formData.wordsToExclude,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit the data.");
      }

      setResponseData(data);
    } catch (err: any) {
      setError(err.message || "Error submitting the form.");
      setDisableButton(false);
      setLoading(false);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setDisableButton(false);
      }, 5000);
    }
  };

  return { handleSubmit, loading, error, responseData, disableButton };
}
