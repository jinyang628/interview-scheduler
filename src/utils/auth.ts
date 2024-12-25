import { logger } from '@/lib/logger';

interface AccessTokenOptions {
  clientId: string;
  scopes: string[];
  interactive: boolean;
}

export default async function getAccessToken({
  clientId,
  scopes,
  interactive,
}: AccessTokenOptions): Promise<string> {
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
