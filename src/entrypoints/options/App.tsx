import { toast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/toaster';

export default function App() {
  const [openAiKey, setOpenAiKey] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');
  const [name, setName] = useState<string>('');

  useEffect(() => {
    browser.storage.sync.get('openAiKey').then((result) => {
      setOpenAiKey(result.openAiKey || '');
    });
    browser.storage.sync.get('clientId').then((result) => {
      setClientId(result.clientId || '');
    });
    browser.storage.sync.get('name').then((result) => {
      setName(result.name || '');
    });
  }, []);

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
          <p className="text-base font-semibold">Your Name:</p>
          <Input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="This will be used to sign off your email reply"
          />

          <Button
            onClick={() => {
              browser.storage.sync.set({ openAiKey: openAiKey });
              browser.storage.sync.set({
                clientId: clientId,
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
