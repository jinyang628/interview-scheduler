import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';

import { Message } from '@/types/email';
import { InferenceResponse, inferenceResponseSchema } from '@/types/inference';

const MODEL_NAME = 'gpt-4o-2024-11-20';

export async function infer(messages: Message[]): Promise<InferenceResponse> {
  let apiKey: string = '';

  try {
    const result = await browser.storage.sync.get('openAiKey');
    if (result.openAiKey) {
      apiKey = result.openAiKey;
    }
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
          content:
            'Extract the calendar event information given the context of the email content. If a zoom/microsoft/google meeting link is specified in the email, you must include it clearly in the description of your response. Additionally, provide a short, polite reply to the sender acknowledging the meeting.',
        },
        {
          role: 'user',
          content: messages.map((msg) => ({
            type: 'text',
            text: `From: ${msg.name} <${msg.email}>\n${msg.content}`,
          })),
        },
      ],
      temperature: 0.7,
      response_format: zodResponseFormat(inferenceResponseSchema, 'result'),
    });

    const result = response.choices[0].message.parsed;

    if (!result) {
      throw new Error('No content found in response');
    }
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
