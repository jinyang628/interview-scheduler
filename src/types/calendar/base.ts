import { z } from 'zod';

export const timeslotSchema = z.object({
  startDateTime: z.string(),
  endDateTime: z.string(),
});

export type Timeslot = z.infer<typeof timeslotSchema>;

export const calendarEventSchema = z.object({
  summary: z.string(),
  description: z.string(),
  timeslot: timeslotSchema,
});

export type CalendarEvent = z.infer<typeof calendarEventSchema>;
