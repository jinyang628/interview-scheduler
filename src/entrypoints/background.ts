import { SCHEDULE_CALENDAR_EVENT_ACTION } from '@/constants/browser';
import scheduleCalendarEvent from '@/utils/calendar/schedule';
import validateTimeslot from '@/utils/calendar/validate';
import extractTimeslot from '@/utils/extract';

import { errorSchema } from '@/types/browser/base';
import {
  scheduleCalendarEventRequestSchema,
  scheduleCalendarEventResponseSchema,
} from '@/types/browser/scheduleCalendarEvent';
import { ScheduleEventResponse } from '@/types/calendar/schedule';
import { TimeslotValidity } from '@/types/calendar/validate';
import { ExtractTimeslotResponse } from '@/types/extract';
import { InferenceConfig, defaultInferenceConfig } from '@/types/config';

import { logger } from '@/lib/logger';

// Currently, we use the default inference config. We can define multiple different configs and choose which one to use here
const INFERENCE_CONFIG: InferenceConfig = defaultInferenceConfig;

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, sender) => {
    // Return a promise that resolves with our response
    switch (message.action) {
      case SCHEDULE_CALENDAR_EVENT_ACTION:
        return (async () => {
          try {
            const input = scheduleCalendarEventRequestSchema.parse(message.input);
            const extractTimeslotResponse: ExtractTimeslotResponse = await extractTimeslot({
              messages: input.messages,
              inferenceConfig: INFERENCE_CONFIG,
            });
            const timeslotValidity: TimeslotValidity = await validateTimeslot(
              extractTimeslotResponse.timeslot,
            );
            logger.info(`Calendar Validity: ${timeslotValidity}`);
            const scheduleEventResponse: ScheduleEventResponse = await scheduleCalendarEvent(
              input.messages,
              timeslotValidity,
            );

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
