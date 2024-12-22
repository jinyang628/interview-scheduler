import { logger } from '@/lib/logger';

export interface CalendarEvent {
  summary: string;
  description?: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

export async function createCalendarEvent(event: CalendarEvent): Promise<string> {
  let apiKey: string = '';
  const result = await browser.storage.sync.get('calendarKey');
  if (result.calendarKey) {
    apiKey = result.calendarKey;
  }
  if (!apiKey) {
    throw new Error('No Google Calendar API key found');
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      },
    );

    if (!response.ok) {
      throw new Error(`Error creating calendar event with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.id) {
      throw new Error('No google calendar event ID found');
    }

    return data.id;
  } catch (error) {
    logger.error('Error creating calendar event:', error as Error);
    throw error;
  }
}
