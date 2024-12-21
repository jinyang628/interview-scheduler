import { logger } from "@/lib/logger";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { CalendarEvent, calendarEventSchema } from "@/types/calendar";

export async function invoke(prompt: string): Promise<CalendarEvent> {
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
    const response = await client.beta.chat.completions.parse({
      model: "gpt-4o-2024-11-20",
      messages: [
        {
          role: "system",
          content:
            "Extract the calendar event information given the context of the email content.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      response_format: zodResponseFormat(calendarEventSchema, "event"),
    });

    const event = response.choices[0].message.parsed;

    if (!event) {
      throw new Error("No content found in response");
    }
    logger.info("OpenAI response:", event);
    return event;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
