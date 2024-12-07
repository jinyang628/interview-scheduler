import { logger } from "@/lib/logger";
import OpenAI from "openai";

export async function invoke(prompt: string): Promise<string> {
  let apiKey: string = "";

  try {
    const result = await browser.storage.sync.get("openAiKey");
    if (result.openAiKey) {
      apiKey = result.openAiKey;
    }
  } catch (error) {
    console.error("Error getting API key from storage:", error);
  }

  if (!apiKey) {
    throw new Error("No OpenAI API key found");
  }

  const client = new OpenAI({
    apiKey: apiKey,
  });

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.7,
    });

    const content: string | null = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content found in response");
    }
    logger.info("OpenAI response:", content);
    return content;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
