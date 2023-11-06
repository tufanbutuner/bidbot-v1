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

    const matches = queryResponse.matches.map((match) => match.metadata);

    // console.log(matches);

    // const context = matches.map((match: any) => match.text).join("\n");

    const prompt = getPrompt(input1, input3);

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

    res.status(200).json({ prompt, matches, text });
  } catch (error) {
    res.status(500).json({ message: "Error creating embeddings" });
  }
}
