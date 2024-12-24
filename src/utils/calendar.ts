import { CalendarEvent } from '@/types/calendar';

import { logger } from '@/lib/logger';

interface AuthTokenOptions {
  clientId: string;
  scopes: string[];
  interactive: boolean;
}

async function getAuthToken({ clientId, scopes, interactive }: AuthTokenOptions): Promise<string> {
  try {
    const authUrl = new URL('https://accounts.google.com/o/oauth2/auth');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('response_type', 'token');
    authUrl.searchParams.append('redirect_uri', chrome.identity.getRedirectURL());
    authUrl.searchParams.append('scope', scopes.join(' '));
    logger.info('Auth URL:', authUrl.toString());

    const responseUrl = await new Promise<string>((resolve, reject) => {
      chrome.identity.launchWebAuthFlow(
        {
          url: authUrl.toString(),
          interactive: interactive,
        },
        (responseUrl) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          if (!responseUrl) {
            reject(new Error('No response URL'));
            return;
          }
          resolve(responseUrl);
        },
      );
    });

    // Extract the access token from the response URL
    const hashParams = new URLSearchParams(new URL(responseUrl).hash.slice(1));
    const accessToken = hashParams.get('access_token');

    if (!accessToken) {
      throw new Error('No access token found in response');
    }

    return accessToken;
  } catch (error) {
    logger.error('Error getting auth token:', error as Error);
    throw new Error('Failed to authenticate with Google Calendar');
  }
}

function constructEventUrl(eventStartDateTime: string): string {
  const date = eventStartDateTime.split('T')[0];
  const [year, month, day] = date.split('-');
  return `https://calendar.google.com/calendar/u/1/r/day/${year}/${month}/${day}`;
}

export async function createCalendarEvent(event: CalendarEvent): Promise<string> {
  logger.info('Creating calendar event:', event.summary);

  try {
    const token = await getAuthToken({
      clientId: await browser.storage.sync.get('clientId').then((result) => result.clientId),
      scopes: ['https://www.googleapis.com/auth/calendar'],
      interactive: true,
    });

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

    return constructEventUrl(data.start.dateTime);
  } catch (error) {
    logger.error('Error creating calendar event:', error as Error);
    throw error;
  }
}
