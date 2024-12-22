import { z } from 'zod';

import { messageSchema } from '@/types/email';

export const extractHtmlResponseSchema = z.object({
  html: z.string(),
});

export type ExtractHtmlResponse = z.infer<typeof extractHtmlResponseSchema>;

export const invokeRequestSchema = z.object({
  messages: z.array(messageSchema),
});
