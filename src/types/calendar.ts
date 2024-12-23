import { z } from 'zod';

export const dateTimeSchema = z.object({
  dateTime: z.string(),
});

export const calendarEventSchema = z.object({
  summary: z.string(),
  description: z.string(),
  meetingLink: z.string().nullable(),
  start: dateTimeSchema,
  end: dateTimeSchema,
});

export type CalendarEvent = z.infer<typeof calendarEventSchema>;
