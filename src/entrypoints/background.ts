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
import { TimeslotValidity, timeslotValiditySchema } from '@/types/calendar/validate';
import { InferenceConfig, defaultInferenceConfig } from '@/types/config';
import { ExtractTimeslotResponse } from '@/types/extract';

import { logger } from '@/lib/logger';

// Currently, we use the default inference config. We can define multiple different configs and choose which one to use here
const INFERENCE_CONFIG: InferenceConfig = defaultInferenceConfig;

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, sender) => {
    // Return a promise that resolves with our response
    let retryCounter: number = 0;
    switch (message.action) {
      case SCHEDULE_CALENDAR_EVENT_ACTION:
        return (async () => {
          try {
            const input = scheduleCalendarEventRequestSchema.parse(message.input);
            let timeslotValidity: TimeslotValidity;
            let extractTimeslotResponse: ExtractTimeslotResponse;
            while (true) {
              extractTimeslotResponse = await extractTimeslot({
                messages: input.messages,
                inferenceConfig: INFERENCE_CONFIG,
              });
              timeslotValidity = await validateTimeslot({
                timeslot: extractTimeslotResponse.timeslot,
              });
              logger.info(`Calendar Validity: ${timeslotValidity}`);
              if (timeslotValidity === timeslotValiditySchema.Values.endDateBeforeStartDate) {
                if (retryCounter >= INFERENCE_CONFIG.retryAttempts) {
                  throw new Error(
                    `Failed to infer the calendar event after ${INFERENCE_CONFIG.retryAttempts} retries`,
                  );
                }
                retryCounter++;
                logger.info(
                  `Retrying inference request ${retryCounter} of ${INFERENCE_CONFIG.retryAttempts} because LLM gave an end date that is before the start date.`,
                );
                continue;
              }
              break;
            }

            const scheduleEventResponse: ScheduleEventResponse = await scheduleCalendarEvent({
              messages: input.messages,
              timeslotValidity: timeslotValidity,
              initialTimeslot: extractTimeslotResponse.timeslot,
              inferenceConfig: INFERENCE_CONFIG,
            });

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
