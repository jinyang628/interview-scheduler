import { z } from 'zod';

import { calendarEventSchema } from '@/types/calendar';

export const inferenceResponseSchema = z.object({
  calendarEvent: calendarEventSchema,
  reply: z.string(),
});

export type InferenceResponse = z.infer<typeof inferenceResponseSchema>;
