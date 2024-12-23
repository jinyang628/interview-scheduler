import { z } from 'zod';

import { errorSchema } from '@/types/browser/base';
import { messageSchema } from '@/types/email';

export const scheduleCalendarEventRequestSchema = z.object({
  messages: z.array(messageSchema),
});

export type ScheduleCalendarEventRequest = z.infer<typeof scheduleCalendarEventRequestSchema>;

export const responseSchema = z.object({
  eventId: z.string(),
});

export const scheduleCalendarEventResponseSchema = z
  .object({
    response: responseSchema.optional(),
    error: errorSchema.optional(),
  })
  .refine((data) => data.response || data.error, {
    message: 'Either response or error should be present',
  });

export type ScheduleCalendarEventResponse = z.infer<typeof scheduleCalendarEventResponseSchema>;
