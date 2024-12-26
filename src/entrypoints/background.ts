import { SCHEDULE_CALENDAR_EVENT_ACTION } from '@/constants/browser';
import createCalendarEvent from '@/utils/calendar/create';
import rescheduleCalendarEvent from '@/utils/calendar/reschedule';
import validateTimeslot from '@/utils/calendar/validate';
import extractTimeslot from '@/utils/extract';

import { errorSchema } from '@/types/browser/base';
import {
  responseSchema,
  scheduleCalendarEventRequestSchema,
  scheduleCalendarEventResponseSchema,
} from '@/types/browser/scheduleCalendarEvent';
import { ExtractTimeslotResponse } from '@/types/extract';

import { logger } from '@/lib/logger';
import { TimeslotValidity } from '@/types/calendar/validate';
import { ScheduleEventResponse } from '@/types/calendar/schedule';

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, sender) => {
    // Return a promise that resolves with our response
    switch (message.action) {
      case SCHEDULE_CALENDAR_EVENT_ACTION:
        return (async () => {
          try {
            const input = scheduleCalendarEventRequestSchema.parse(message.input);
            const extractTimeslotResponse: ExtractTimeslotResponse = await extractTimeslot(
              input.messages,
            );
            const timeslotValidity: TimeslotValidity = await validateTimeslot(
              extractTimeslotResponse.timeslot,
            );
            logger.info(`Calendar Validity: ${timeslotValidity}`);
            const scheduleEventResponse: ScheduleEventResponse = await rescheduleCalendarEvent(
              input.messages,
              timeslotValidity,
            );

            // We always want to schedule an event even if the proposed timeslot is problematic (for manual verification + putting a calendar placeholder so we don't schedule other interviews at the same time)
            const eventUrl: string = await createCalendarEvent(rescheduledCalendarEvent);
            const scheduleCalendarEventResponse = scheduleCalendarEventResponseSchema.parse({
              response: scheduleEventResponse,
            });
            logger.info('Schedule Calendar Event response:', scheduleCalendarEventResponse);
            return scheduleCalendarEventResponse;
          } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
              return scheduleCalendarEventResponseSchema.parse({
                error: errorSchema.parse({
                  message: error.message,
                }),
              });
            } else {
              return scheduleCalendarEventResponseSchema.parse({
                error: errorSchema.parse({
                  message: 'Unknown error',
                }),
              });
            }
          }
        })();

      default:
        console.error('Action not recognised in background script');
        return undefined;
    }
  });
});
