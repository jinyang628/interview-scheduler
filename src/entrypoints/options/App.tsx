import { FaGoogle } from 'react-icons/fa';

import { DAY_OPTIONS, TIMEZONE_OPTIONS, TIME_OPTIONS } from '@/constants/calendar';
import { toast } from '@/hooks/use-toast';
import { getAuthTokens, isAccessTokenValid, refreshAccessToken } from '@/utils/auth';
import { CheckCircle } from 'lucide-react';
import { XCircle } from 'lucide-react';

import IndividualSelectDropdown from '@/components/shared/individual-select-dropdown';
import Loader from '@/components/shared/loader';
import MultipleSelectDropdown from '@/components/shared/multiple-select-dropdown';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/toaster';

type AuthenticationStatus = 'no' | 'yes' | 'loading' | 'error';

export default function App() {
  const [openAiKey, setOpenAiKey] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [preferredDays, setPreferredDays] = useState<string[]>([]);
  const [timezone, setTimezone] = useState<string>('');

  const [authenticationStatus, setAuthenticationStatus] = useState<AuthenticationStatus>('loading');

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

        const isValid: boolean = await isAccessTokenValid(accessToken);
        if (isValid) {
          setAuthenticationStatus('yes');
          return;
        }

        await browser.storage.sync.set({
          accessToken: await refreshAccessToken({
            refreshToken: await browser.storage.sync
              .get('refreshToken')
              .then((result) => result.refreshToken)
              .catch(() => ''),
            clientId: await browser.storage.sync
              .get('clientId')
              .then((result) => result.clientId)
              .catch(() => ''),
            clientSecret: await browser.storage.sync
              .get('clientSecret')
              .then((result) => result.clientSecret)
              .catch(() => ''),
          }),
        });
        setAuthenticationStatus('yes');
      } catch (error: unknown) {
        console.error(error);
        setAuthenticationStatus('no');
      }
    };

    setAuthenticationStatus('loading');
    initializeStates();
  }, []);

  const handleAuthentication = async () => {
    try {
      const { accessToken, refreshToken } = await getAuthTokens({
        clientId: clientId,
        clientSecret: clientSecret,
        scopes: ['https://www.googleapis.com/auth/calendar'],
        interactive: true,
      });
      await browser.storage.sync.set({
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
      setAuthenticationStatus('yes');
    } catch (error) {
      console.error(error);
      setAuthenticationStatus('error');
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
          <p className="text-base font-semibold">Preferred Interview Timings:</p>
          <div className="flex justify-around">
            <div className="flex w-[40%] space-x-4">
              <div className="flex w-[40%] justify-center">
                <IndividualSelectDropdown
                  name="Earliest Start Time"
                  items={TIME_OPTIONS}
                  selectedItem={startTime}
                  onSelectItem={(item) => setStartTime(item)}
                />
              </div>
              <p className="flex justify-center">-</p>
              <div className="flex w-[40%] justify-center">
                <IndividualSelectDropdown
                  name="Latest End Time"
                  items={TIME_OPTIONS}
                  selectedItem={endTime}
                  onSelectItem={(item) => setEndTime(item)}
                />
              </div>
            </div>
            <MultipleSelectDropdown
              name="Preferred Days"
              items={DAY_OPTIONS}
              selectedItems={preferredDays}
              onSelectItems={(items) => setPreferredDays(items)}
              order={DAY_OPTIONS}
            />
            <IndividualSelectDropdown
              name="Timezone"
              items={TIMEZONE_OPTIONS}
              selectedItem={timezone}
              onSelectItem={(item) => setTimezone(item)}
            />
          </div>

          <div className="flex items-center justify-center space-x-2">
            <Button className="gap-2" disabled={!clientId} onClick={handleAuthentication}>
              <FaGoogle className="size-5" />
              Authenticate with Google
            </Button>
            {authenticationStatus === 'yes' ? (
              <CheckCircle className="size-8 text-green-500" />
            ) : authenticationStatus === 'no' || authenticationStatus === 'error' ? (
              <XCircle className="size-8 text-red-500" />
            ) : authenticationStatus === 'loading' ? (
              <Loader isLoading={true} />
            ) : null}
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
              browser.storage.sync.set({ startTime: startTime });
              browser.storage.sync.set({ endTime: endTime });
              browser.storage.sync.set({ preferredDays: preferredDays });
              browser.storage.sync.set({ timezone: timezone });
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
