import OpenAI from "openai";

function createOpenAIClient(apiKey: string) {
  return new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });
}

export async function generateText(prompt: string) {
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

  const client = createOpenAIClient(apiKey);

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
