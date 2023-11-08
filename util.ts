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
