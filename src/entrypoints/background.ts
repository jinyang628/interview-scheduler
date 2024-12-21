import { INVOKE_ACTION } from "@/constants/browser";
import { logger } from "@/lib/logger";
import { invokeRequestSchema } from "@/types/browser";
import { CalendarEvent } from "@/types/calendar";
import { invoke } from "@/utils/openai";

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(
    async (message, sender, sendResponse) => {
      switch (message.action) {
        case INVOKE_ACTION:
          const input = invokeRequestSchema.parse(message.input);
          const calendarEvent: CalendarEvent = await invoke(input.messages);
          const eventId: string = await createCalendarEvent(calendarEvent);
          logger.info("Google Calendar Event ID:", eventId);
          sendResponse({ eventId });
        default:
          break;
      }
      return true;
    },
  );
});
