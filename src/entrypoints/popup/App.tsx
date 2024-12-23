import { EXTRACT_HTML_ACTION, SCHEDULE_CALENDAR_EVENT_ACTION } from '@/constants/browser';
import { extractEmail } from '@/utils/email';

import Loader from '@/components/shared/loader';
import { Button } from '@/components/ui/button';

import { extractHtmlResponseSchema } from '@/types/browser/extractHtml';
import {
  scheduleCalendarEventRequestSchema,
  scheduleCalendarEventResponseSchema,
} from '@/types/browser/scheduleCalendarEvent';
import { Message } from '@/types/email';

import { logger } from '@/lib/logger';

import '@/styles/globals.css';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const bookMeeting = async () => {
    setIsLoading(true);
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });

    const extractHtmlResponse = extractHtmlResponseSchema.parse(
      await browser.tabs.sendMessage(tab.id!, {
        action: EXTRACT_HTML_ACTION,
      }),
    );
    const messages: Message[] = extractEmail(extractHtmlResponse.html);

    const input = scheduleCalendarEventRequestSchema.parse({
      messages: messages,
    });
    const scheduleCalendarEventResponse = scheduleCalendarEventResponseSchema.parse(
      await browser.runtime.sendMessage({
        action: SCHEDULE_CALENDAR_EVENT_ACTION,
        input: input,
      }),
    );
    setIsLoading(false);
  };

  return (
    // This should be the only container with hard coded width and height
    <div className="flex h-[200px] w-[200px] flex-col items-center justify-center space-y-5">
      <Button onClick={bookMeeting}>Book Meeting!</Button>
      <Loader isLoading={isLoading} />
    </div>
  );
}
