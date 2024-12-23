import { CalendarEvent } from '@/types/calendar';

import { logger } from '@/lib/logger';

interface AuthTokenResponse {
  token: string;
  grantedScopes: string[];
}

async function getAuthToken(): Promise<string> {
  try {
    const auth = (await browser.identity.getAuthToken({
      interactive: true,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    })) as unknown as AuthTokenResponse; // Ugly type casting that works for chrome but not compatible with firefox at the moment
    return auth.token;
  } catch (error) {
    logger.error('Error getting auth token:', error as Error);
    throw new Error('Failed to authenticate with Google Calendar');
  }
}

export async function createCalendarEvent(event: CalendarEvent): Promise<string> {
  logger.info('Creating calendar event:', event.summary);

  try {
    const token = await getAuthToken();

    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logger.error('Calendar API error response:', errorData);
      throw new Error(`Error creating calendar event with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.id) {
      throw new Error('No google calendar event ID found');
    }

    logger.info('Successfully created calendar event with ID:', data.id);
    return data.id;
  } catch (error) {
    logger.error('Error creating calendar event:', error as Error);
    throw error;
  }
}
