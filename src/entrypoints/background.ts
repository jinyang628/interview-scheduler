import { SCHEDULE_CALENDAR_EVENT_ACTION } from '@/constants/browser';
import { createCalendarEvent } from '@/utils/calendar/create';
import { isTimeSlotAvailable } from '@/utils/calendar/get';
import { infer } from '@/utils/inference';

import { errorSchema } from '@/types/browser/base';
import {
  responseSchema,
  scheduleCalendarEventRequestSchema,
  scheduleCalendarEventResponseSchema,
} from '@/types/browser/scheduleCalendarEvent';
import { InferenceResponse } from '@/types/inference';

import { logger } from '@/lib/logger';

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, sender) => {
    // Return a promise that resolves with our response
    switch (message.action) {
      case SCHEDULE_CALENDAR_EVENT_ACTION:
        return (async () => {
          try {
            const input = scheduleCalendarEventRequestSchema.parse(message.input);
            const inferenceResponse: InferenceResponse = await infer(input.messages);
            const isAvailable: boolean = await isTimeSlotAvailable(inferenceResponse.calendarEvent);
            if (!isAvailable) {
              throw new Error('Time slot is not available');
            }
            const eventUrl: string = await createCalendarEvent(inferenceResponse.calendarEvent);
            const scheduleCalendarEventResponse = scheduleCalendarEventResponseSchema.parse({
              response: responseSchema.parse({
                reply: inferenceResponse.reply,
                eventUrl: eventUrl,
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
