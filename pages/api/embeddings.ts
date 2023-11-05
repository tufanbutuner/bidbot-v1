import type { NextApiRequest, NextApiResponse } from "next";

import { pinecone } from "../../config";
import { chatCompletions, createEmbeddings, getPrompt } from "../../util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await createEmbeddings({
      model: "text-embedding-ada-002",
      input: req.body.input,
    });

    const index = pinecone.index(`${process.env.PINECONE_INDEX_NAME}`);

    const queryResponse = await index.query({
      vector: result,
      topK: 5,
      includeMetadata: true,
    });

    const matches = queryResponse.matches.map((match) => match.metadata);

    const context = matches.map((match: any) => match.text).join("\n");

    console.log(context);

    const prompt = getPrompt(context, req.body.input);

    const messages = [];

    messages.push({
      role: "user",
      content: prompt,
    });

    const reply = await chatCompletions({
      body: {
        model: "gpt-3.5-turbo",
        messages,
      },
    });

    const data = await reply.json();
    const text = data.choices[0].message.content;

    console.log(text);

    res.status(200).json({ text });
  } catch (error) {
    res.status(500).json({ message: "Error creating embeddings" });
  }
}