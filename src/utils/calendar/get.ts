import { z } from 'zod';

import { CalendarEvent, calendarEventSchema } from '@/types/calendar';

import { logger } from '@/lib/logger';

type CalendarEventFilterParameters = {
  startDateTime: string;
  endDateTime: string;
};

export async function getCalendarEvents({
  startDateTime,
  endDateTime,
}: CalendarEventFilterParameters): Promise<CalendarEvent[]> {
  const params = new URLSearchParams({
    timeMin: new Date(startDateTime).toISOString(),
    timeMax: new Date(endDateTime).toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
  });

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${await browser.storage.sync.get('accessToken').then((result) => result.accessToken)}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    logger.error('Calendar API error response:', errorData);
    throw new Error(`Error getting calendar events with status: ${response.status}`);
  }

  const data = await response.json();
  const parsedEvents = z.array(calendarEventSchema).parse(data.items);
  return parsedEvents;
}

export async function isTimeSlotAvailable(event: CalendarEvent): Promise<boolean> {
  const startDateTime = event.start.dateTime;
  const endDateTime = event.end.dateTime;

  const startDate = new Date(startDateTime);
  const endDate = new Date(endDateTime);

  const currentDate = new Date();

  // if (currentDate < startDate || currentDate > endDate) {
  //   // TODO: Consider raising special errors that can be easily handled by the LLM
  //   throw new Error('Current date is not within the time slot');
  // }

  if (endDate <= startDate) {
    // TODO: Consider raising special errors that can be easily handled by the LLM
    throw new Error('End date cannot be before start date');
  }

  const events: CalendarEvent[] = await getCalendarEvents({ startDateTime, endDateTime });
  if (events.length > 0) {
    logger.info('Time slot is already booked');
    return false;
  }

  return true;
}
