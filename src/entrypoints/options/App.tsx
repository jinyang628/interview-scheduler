import { toast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/toaster';

export default function App() {
  const [openAiKey, setOpenAiKey] = useState<string>('');

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
          <Button
            onClick={() => {
              browser.storage.sync.set({ openAiKey: openAiKey });
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
