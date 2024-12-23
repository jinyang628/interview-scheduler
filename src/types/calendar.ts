import { z } from 'zod';

export const dateTimeSchema = z.object({
  dateTime: z.string(),
});

export const calendarEventSchema = z.object({
  summary: z.string(),
  description: z.string(),
  start: dateTimeSchema,
  end: dateTimeSchema,
});

export type CalendarEvent = z.infer<typeof calendarEventSchema>;
