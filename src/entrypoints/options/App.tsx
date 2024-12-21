import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function App() {
  const [openAiKey, setOpenAiKey] = useState<string>("");
  const [calendarKey, setCalendarKey] = useState<string>("");

  return (
    <div className="flex justify-center h-screen w-full p-8">
      <Toaster />
      <div className="flex justify-center flex-col space-y-4 max-w-[600px] max-h-[600px] w-full p-4 mx-auto">
        <Card className="flex flex-col justify-center align-middle space-y-4 max-w-[auto] p-4 w-full mx-auto">
          <p className="text-base font-semibold">OpenAI API Key:</p>
          <Input
            onChange={(e) => setOpenAiKey(e.target.value)}
            value={openAiKey}
            placeholder="Enter your OpenAI API key"
          />
          <p className="text-base font-semibold">Google Calendar API Key:</p>
          <Input
            onChange={(e) => setCalendarKey(e.target.value)}
            value={calendarKey}
            placeholder="Enter your Google Calendar API key"
          />

          <Button
            onClick={() => {
              browser.storage.sync.set({ openAiKey: openAiKey });
              browser.storage.sync.set({
                calendarKey: calendarKey,
              });
              toast({
                title: "Settings saved!",
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
