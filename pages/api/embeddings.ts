import type { NextApiRequest, NextApiResponse } from "next";

import { RecordMetadata } from "@pinecone-database/pinecone";
import { ChatCompletionMessageParam } from "openai/resources";
import { pinecone } from "../../config";
import {
  chatCompletions,
  createEmbeddings,
  createLogitBias,
  encoding,
  getPrompt,
  model,
} from "../../util";

const MAX_TOKEN_LIMIT = 3700;

interface MatchesProps {
  score: number | undefined;
  metadata: RecordMetadata | undefined;
  tokens: number;
}

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
    const wordsToInclude = req.body.wordsToInclude;
    const wordsToExclude = req.body.wordsToExclude;

    const logit_bias = createLogitBias(wordsToInclude, wordsToExclude);

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

    const matches: MatchesProps[] = queryResponse.matches.map((match) => ({
      score: match.score,
      metadata: match.metadata,
      tokens: encoding.encode([match.metadata?.text].join(" ")).length,
    }));

    let totalTokenCount = 0;
    let includedContexts = [];
    let documentsUsed = 0;

    for (let match of matches) {
      const tokenCount = match.tokens;

      if (totalTokenCount + tokenCount > MAX_TOKEN_LIMIT) {
        break;
      }

      totalTokenCount += tokenCount;
      includedContexts.push(match.metadata?.text);
      documentsUsed++;
    }

    console.log("totalTokenCount: " + totalTokenCount);
    console.log("documents used: " + documentsUsed);

    const contextFromDb = includedContexts.join("\n");

    const prompt = getPrompt(input1, contextFromDb, input3);

    const messages: ChatCompletionMessageParam[] = [];

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

    const tokenAmount = messages.reduce(
      (total, msg) => total + encoding.encode(msg.content ?? "").length,
      0
    );

    const reply = await chatCompletions({
      body: {
        model: model,
        messages,
        temperature: 0,
        max_tokens: 200,
        logit_bias: logit_bias,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: "none",
      },
    });

    const data = await reply.json();

    const text = data.choices[0].message.content;

    const wordCount = text
      .split(/\s+/)
      .filter((word: string) => word.length > 0).length;

    const charCount = text.length;

    res.status(200).json({
      prompt,
      matches,
      text,
      wordCount,
      charCount,
      totalTokenCount,
      tokenAmount,
      documentsUsed,
    });
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error getting a response.", error: error.message });
  }
}
