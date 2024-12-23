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

type SchedulingStatus = 'idle' | 'loading' | 'success' | 'error';

export default function App() {
  const [schedulingStatus, setSchedulingStatus] = useState<SchedulingStatus>('idle');
  const bookMeeting = async () => {
    setSchedulingStatus('loading');
    try {
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
      setSchedulingStatus('success');
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(error.message);
      } else {
        console.error(error);
      }
      setSchedulingStatus('error');
    }
  };

  return (
    // This should be the only container with hard coded width and height
    <div className="flex h-[200px] w-[200px] flex-col items-center justify-center space-y-5">
      <Button onClick={bookMeeting}>Book Meeting!</Button>
      <Loader isLoading={schedulingStatus === 'loading'} />
      {schedulingStatus === 'success' && (
        <div className="text-center">
          <p className="text-base font-semibold">Meeting Booked!</p>
          <p className="text-sm">
            You can now close this tab and return to your calendar to view the meeting details.
          </p>
        </div>
      )}
      {schedulingStatus === 'error' && (
        <div className="text-center">
          <p className="text-base font-semibold">Error scheduling meeting!</p>
          <p className="text-sm">Please try again later.</p>
        </div>
      )}
    </div>
  );
}
