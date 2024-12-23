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
    const responsePromise = (async () => {
      switch (message.action) {
        case SCHEDULE_CALENDAR_EVENT_ACTION:
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
            if (error instanceof Error) {
              logger.error(error.message);
              return scheduleCalendarEventResponseSchema.parse({
                error: errorSchema.parse({
                  message: error.message,
                }),
              });
            } else {
              console.error(error);
              return scheduleCalendarEventResponseSchema.parse({
                error: errorSchema.parse({
                  message: 'Unknown error',
                }),
              });
            }
          }

        default:
          logger.error('Action not recognised in background script');
          return undefined;
      }
    })();

    // Return true to indicate we'll send response asynchronously
    return true;
  });
});
