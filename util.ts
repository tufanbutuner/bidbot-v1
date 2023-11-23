import { encoding_for_model } from "tiktoken";
import { OpenAiHeaders } from "./config";

interface CreateEmbeddingsResponse {
  error: string | null;
  data: any; // Change this type based on the actual response structure
}

interface CreateEmbeddingsProps {
  model: string;
  input: string;
}

interface QueryDbProps {
  vector: string;
  namespace: string;
}

export const model = "gpt-3.5-turbo";
export const encoding = encoding_for_model(model);

export const createEmbeddings = async ({
  input,
  model,
}: CreateEmbeddingsProps): Promise<any> => {
  try {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: OpenAiHeaders,
      body: JSON.stringify({ input, model }),
    });

    const { error, data }: CreateEmbeddingsResponse = await response.json();

    if (error) {
      throw new Error(error);
    }

    return data[0].embedding;
  } catch (error: any) {
    throw new Error("Error creating embeddings: " + error);
  }
};

// Template and context to build the prompt
const template = `{CONTEXT_FROM_USER}
Context: {CONTEXT_FROM_DATABASE}
Question: {QUERY}
Answer: `;

export const getPrompt = (
  userContext: string,
  dataContext: string,
  query: any
) => {
  return template
    .replace("{CONTEXT_FROM_USER}", userContext)
    .replace("{CONTEXT_FROM_DATABASE}", dataContext)
    .replace("{QUERY}", query);
};

export const chatCompletions = async ({ body }: any) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: OpenAiHeaders,
    body: JSON.stringify(body),
  });

  return response;
};

export function createLogitBias(promote: string[], exclude: string[]) {
  const posFactor = 5;
  const negFactor = -100;
  const retLogit: Record<string, number> = {};

  const processWords = (words: string[], factor: number) => {
    for (const word of words) {
      for (const token of [
        ...encoding.encode(word),
        ...encoding.encode(" " + word),
      ]) {
        retLogit[token] = factor;
      }
    }
  };

  processWords(promote, posFactor);
  processWords(exclude, negFactor);

  console.log(
    "Excluded Words: " +
      exclude.join(", ") +
      "\nPromoted Words: " +
      promote.join(", ")
  );

  return retLogit;
}
