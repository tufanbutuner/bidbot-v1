import type { NextApiRequest, NextApiResponse } from "next";

import { pinecone } from "../../config";
import { chatCompletions, createEmbeddings, getPrompt } from "../../util";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let input1 = req.body.input1;
    if (input1.length > 4000) {
      input1 = input1.substring(0, 4000);
    }
    const input2 = parseInt(req.body.input2, 10);
    const input3 = req.body.input3;

    const result = await createEmbeddings({
      model: "text-embedding-ada-002",
      input: input3,
    });

    const index = pinecone.index(`${process.env.PINECONE_INDEX_NAME}`);

    const queryResponse = await index.query({
      vector: result,
      topK: input2,
      includeMetadata: true,
    });

    const matches = queryResponse.matches.map((match) => ({
      score: match.score,
      metadata: match.metadata,
    }));

    const contextFromDb = matches
      .map((match) => match.metadata?.text)
      .join("\n");

    const prompt = getPrompt(input1, contextFromDb, input3);

    const messages = [];

    messages.push(
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: input3,
      }
    );

    const reply = await chatCompletions({
      body: {
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0,
        max_tokens: 200,
      },
    });

    const data = await reply.json();

    const text = data.choices[0].message.content;

    const wordCount = text
      .split(/\s+/)
      .filter((word: string) => word.length > 0).length;

    const charCount = text.length;

    res.status(200).json({ prompt, matches, text, wordCount, charCount });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "Error getting a response." });
  }
}
