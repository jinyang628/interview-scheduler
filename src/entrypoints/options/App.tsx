import { FaGoogle } from 'react-icons/fa';

import { toast } from '@/hooks/use-toast';
import { getAuthTokens, isAccessTokenValid, refreshAccessToken } from '@/utils/auth';
import { CheckCircle } from 'lucide-react';
import { XCircle } from 'lucide-react';
import { set } from 'zod';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/toaster';

import { logger } from '@/lib/logger';

export default function App() {
  const [openAiKey, setOpenAiKey] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const initializeStates = async () => {
      browser.storage.sync.get('openAiKey').then((result) => {
        setOpenAiKey(result.openAiKey || '');
      });
      browser.storage.sync.get('clientId').then((result) => {
        setClientId(result.clientId || '');
      });
      browser.storage.sync.get('clientSecret').then((result) => {
        setClientSecret(result.clientSecret || '');
      });
      browser.storage.sync.get('name').then((result) => {
        setName(result.name || '');
      });
      try {
        const accessToken: string = await browser.storage.sync
          .get('accessToken')
          .then((result) => result.accessToken)
          .catch(() => '');

        const isValid = await isAccessTokenValid(accessToken);
        if (isValid) {
          setIsAuthenticated(true);
        }

        const refreshToken: string = await browser.storage.sync
          .get('refreshToken')
          .then((result) => result.refreshToken)
          .catch(() => '');
        const clientId: string = await browser.storage.sync
          .get('clientId')
          .then((result) => result.clientId)
          .catch(() => '');

        await browser.storage.sync.set({
          accessToken: await refreshAccessToken({
            refreshToken: refreshToken,
            clientId: clientId,
          }),
        });
        setIsAuthenticated(true);
      } catch (error: unknown) {
        logger.error('Error initializing states:', error as Error);
        setIsAuthenticated(false);
      }
    };

    initializeStates();
  }, []);


  useEffect(() => {
    browser.storage.sync.set({ isAuthenticated: false });
  }, [isAuthenticated]);

  const handleAuthentication = async () => {
    try {
      const { accessToken, refreshToken } = await getAuthTokens({
        clientId: await browser.storage.sync.get('clientId').then((result) => result.clientId),
        clientSecret: await browser.storage.sync
          .get('clientSecret')
          .then((result) => result.clientSecret),
        scopes: ['https://www.googleapis.com/auth/calendar'],
        interactive: true,
      });
      console.log('Access token:', accessToken);
      console.log('Refresh token:', refreshToken);
      await browser.storage.sync.set({
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error(error);
      setIsAuthenticated(false);
    }
  };

  return (
    <div className="flex h-screen w-full justify-center p-8">
      <Toaster />
      <div className="mx-auto flex max-h-[600px] w-full max-w-[600px] flex-col justify-center space-y-4 p-4">
        <Card className="mx-auto flex w-full max-w-[auto] flex-col justify-center space-y-4 p-4 align-middle">
          <p className="text-base font-semibold">OpenAI API Key:</p>
          <Input
            type="password"
            onChange={(e) => setOpenAiKey(e.target.value)}
            value={openAiKey}
            placeholder="Enter your OpenAI API key"
          />
          <p className="text-base font-semibold">Google Cloud Project's Client ID:</p>
          <Input
            type="password"
            onChange={(e) => setClientId(e.target.value)}
            value={clientId}
            placeholder="Enter your Google Cloud Project's Client ID"
          />
          <p className="text-base font-semibold">Google Cloud Project's Client Secret:</p>
          <Input
            type="password"
            onChange={(e) => setClientSecret(e.target.value)}
            value={clientSecret}
            placeholder="Enter your Google Cloud Project's Client Secret"
          />
          <p className="text-base font-semibold">Your Name:</p>
          <Input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="This will be used to sign off your email reply"
          />

          <div className="flex items-center justify-center space-x-2">
            <Button className="gap-2" disabled={!clientId} onClick={handleAuthentication}>
              <FaGoogle className="h-5 w-5" />
              Authenticate with Google
            </Button>
            {isAuthenticated ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500" />
            )}
          </div>

          <Button
            onClick={() => {
              browser.storage.sync.set({ openAiKey: openAiKey });
              browser.storage.sync.set({
                clientId: clientId,
              });
              browser.storage.sync.set({
                clientSecret: clientSecret,
              });
              browser.storage.sync.set({ name: name });
              toast({
                title: 'Settings saved!',
                duration: 1500,
              });
            }}
          >
            Save
          </Button>
        </Card>
      </div>
    </div>
  );
}
