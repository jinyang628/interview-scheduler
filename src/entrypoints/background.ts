import { SCHEDULE_CALENDAR_EVENT_ACTION } from '@/constants/browser';
import { createCalendarEvent } from '@/utils/calendar';
import { invoke } from '@/utils/openai';

import { errorSchema } from '@/types/browser/base';
import {
  responseSchema,
  scheduleCalendarEventRequestSchema,
  scheduleCalendarEventResponseSchema,
} from '@/types/browser/scheduleCalendarEvent';
import { CalendarEvent } from '@/types/calendar';

import { logger } from '@/lib/logger';

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, sender) => {
    // Return a promise that resolves with our response
    switch (message.action) {
      case SCHEDULE_CALENDAR_EVENT_ACTION:
        return (async () => {
          try {
            const input = scheduleCalendarEventRequestSchema.parse(message.input);
            const calendarEvent: CalendarEvent = await invoke(input.messages);
            const eventId: string = await createCalendarEvent(calendarEvent);
            logger.info('Google Calendar Event ID:', eventId);

            const scheduleCalendarEventResponse = scheduleCalendarEventResponseSchema.parse({
              response: responseSchema.parse({
                eventId: eventId,
              }),
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
