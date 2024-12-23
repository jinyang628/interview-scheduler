import { EXTRACT_HTML_ACTION, SCHEDULE_CALENDAR_EVENT_ACTION } from '@/constants/browser';
import { extractEmail } from '@/utils/email';

import CopyableText from '@/components/shared/copyable-text';
import Loader from '@/components/shared/loader';
import { Button } from '@/components/ui/button';

import { extractHtmlResponseSchema } from '@/types/browser/extractHtml';
import {
  ScheduleCalendarEventResponse,
  scheduleCalendarEventRequestSchema,
  scheduleCalendarEventResponseSchema,
} from '@/types/browser/scheduleCalendarEvent';
import { Message } from '@/types/email';

import { logger } from '@/lib/logger';

import '@/styles/globals.css';

type SchedulingStatus = 'idle' | 'loading' | 'success' | 'error';

export default function App() {
  const [scheduleCalendarEventResponse, setScheduleCalendarEventResponse] =
    useState<ScheduleCalendarEventResponse | null>(null);
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
      setScheduleCalendarEventResponse(scheduleCalendarEventResponse);
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
    <div className="flex h-[400px] w-[400px] flex-col items-center justify-center space-y-5">
      {['idle', 'loading', 'error'].includes(schedulingStatus) ? (
        <>
          <Button onClick={bookMeeting}>Book Meeting!</Button>
          <Loader isLoading={schedulingStatus === 'loading'} />
        </>
      ) : (
        <div className="mx-5">
          <CopyableText text={scheduleCalendarEventResponse?.response!.reply || ''} />
        </div>
      )}

      <div
        className="text-center"
        style={{ opacity: ['success', 'error'].includes(schedulingStatus) ? 1 : 0 }}
      >
        <p
          className={`text-base font-semibold ${schedulingStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}
        >
          {schedulingStatus === 'success' ? 'Meeting Booked!' : 'Error scheduling meeting!'}
        </p>
        <p className="text-sm">
          {schedulingStatus === 'success' ? (
            <>
              Meeting details are in your{' '}
              <a
                href={scheduleCalendarEventResponse?.response!.eventUrl || ''}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                calendar
              </a>
              .
            </>
          ) : (
            'Refresh the page and try again.'
          )}
        </p>
      </div>
    </div>
  );
}
