import { z } from 'zod';

export const scheduleEventResponseSchema = z.object({
  reply: z.string(),
  eventUrl: z.string(),
});

export type ScheduleEventResponse = z.infer<typeof scheduleEventResponseSchema>;
