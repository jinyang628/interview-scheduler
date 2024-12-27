import createCalendarEvent from '@/utils/calendar/create';
import { getInferenceClient } from '@/utils/inference';

import {
  ScheduleCalendarEventResponse,
  scheduleCalendarEventResponseSchema,
} from '@/types/browser/scheduleCalendarEvent';
import { Timeslot, calendarEventSchema } from '@/types/calendar/base';
import {
  scheduleEventResponseSchema,
  validTimeSlotResponseSchema,
} from '@/types/calendar/schedule';
import { TimeslotValidity, timeslotValiditySchema } from '@/types/calendar/validate';
import { InferenceConfig } from '@/types/config';
import { EmailMessage } from '@/types/email';
import { role } from '@/types/inference';

const VALID_TIME_SLOT_SYSTEM_PROMPT = `You have 2 tasks.

1. Extract the calendar event information given the context of the email content. If a zoom/microsoft/google meeting link or hackkerank/codepair link is specified in the email, you must include it clearly in the description of your response.

2. Provide a short, polite email reply to the sender acknowledging the date and time of the meeting. You should OMIT the "Best regards..." suffix in your reply.`;

type ScheduleCalendarEventProps = {
  messages: EmailMessage[];
  timeslotValidity: TimeslotValidity;
  initialTimeslot: Timeslot;
  inferenceConfig: InferenceConfig;
};

export default async function scheduleCalendarEvent({
  messages,
  timeslotValidity,
  initialTimeslot,
  inferenceConfig,
}: ScheduleCalendarEventProps): Promise<ScheduleCalendarEventResponse> {
  const client = await getInferenceClient(inferenceConfig);

  // We always want to schedule an event even if the proposed timeslot is problematic (for manual verification + putting a calendar placeholder so we don't schedule other interviews at the same time)
  switch (timeslotValidity) {
    case timeslotValiditySchema.Values.valid:
      const llmResponse = await client.infer({
        messages: [
          {
            role: role.Values.system,
            content: VALID_TIME_SLOT_SYSTEM_PROMPT,
          },
          {
            role: role.Values.user,
            content: messages
              .map((msg) => `From: ${msg.name} <${msg.email}>\n${msg.content}`)
              .join('\n'),
          },
        ],
        responseFormat: validTimeSlotResponseSchema,
      });
      const createCalendarEventRequest = calendarEventSchema.parse({
        summary: llmResponse.summary,
        description: llmResponse.description,
        timeslot: initialTimeslot,
      });
      const eventUrl: string = await createCalendarEvent(createCalendarEventRequest);
      const response = scheduleEventResponseSchema.parse({
        eventUrl: eventUrl,
        reply: llmResponse.reply,
      });
      return scheduleCalendarEventResponseSchema.parse({
        response: response,
      });

    case timeslotValiditySchema.Values.endDateBeforeStartDate:
      throw new Error('End date cannot be before start date');
    case timeslotValiditySchema.Values.currentDatePastStartDate:
      return await createCalendarEvent(messages);
    case timeslotValiditySchema.Values.booked:
      return await createCalendarEvent(messages);
    default:
      throw new Error('Invalid calendar event validity');
  }

  //   const startDateBoundary = new Date(startDate.getTime() - 12 * 60 * 60 * 1000);
  //   const endDateBoundary = new Date(endDate.getTime() + 12 * 60 * 60 * 1000);
  //   const events: CalendarEvent[] = await getCalendarEvents({ startDateBoundary, endDateBoundary });
  // =  if (currentDate >= startDate) {
  //     const newlyProposedCalendarEvent: CalendarEvent = await rescheduleInterview({
  //       rescheduleReason: calendarEventValiditySchema.Values.currentDatePastStartDate,
  //       initialEvent: event,
  //       startDateBoundary,
  //       endDateBoundary,
  //     });
  //     throw new CurrentDatePastStartDateError(
  //       'Current date is not within the time slot. Proposing to reschedule the interview...',
  //       newlyProposedCalendarEvent,
  //     );
  //   }
}
