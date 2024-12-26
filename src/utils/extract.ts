import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';

import { Message } from '@/types/email';
import { ExtractTimeslotResponse, extractTimeslotResponseSchema } from '@/types/extract';

const MODEL_NAME = 'gpt-4o-2024-11-20';

// const SYSTEM_PROMPT = `You have 2 tasks.

// 1. Extract the calendar event information given the context of the email content. If a zoom/microsoft/google meeting link or hackkerank/codepair link is specified in the email, you must include it clearly in the description of your response.

// 2. Provide a short, polite email reply to the sender acknowledging the meeting. You should INCLUDE the "Dear [SENDER NAME],\n" prefix but OMIT the "Best regards..." suffix in your reply.`;

// const EMAIL_REPLY_TEMPLATE = (content: string, name: string) => `${content}

// Best regards,
// ${name}`;

// result.reply = EMAIL_REPLY_TEMPLATE(
//   result.reply,
//   await browser.storage.sync.get('name').then((result) => result.name),
// );

const SYSTEM_PROMPT = `Extract the start and end datetime of the interview in the email.`;


export default async function extractTimeslot(messages: Message[]): Promise<ExtractTimeslotResponse> {
  let apiKey: string = '';

  try {
    apiKey = await browser.storage.sync.get('openAiKey').then((result) => result.openAiKey);
  } catch (error) {
    console.error('Error getting API key from storage:', error);
  }

  if (!apiKey) {
    throw new Error('No OpenAI API key found');
  }

  const client = new OpenAI({
    apiKey: apiKey,
  });

  try {
    const response = await client.beta.chat.completions.parse({
      model: MODEL_NAME,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: messages.map((msg) => ({
            type: 'text',
            text: `From: ${msg.name} <${msg.email}>\n${msg.content}`,
          })),
        },
      ],
      temperature: 0,
      response_format: zodResponseFormat(extractTimeslotResponseSchema, 'result'),
    });

    const result = response.choices[0].message.parsed;

    if (!result) {
      throw new Error('No content found in response');
    }

    return result;
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
}
