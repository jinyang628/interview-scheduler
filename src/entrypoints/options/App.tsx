import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function App() {
  const [openAiKey, setOpenAiKey] = useState<string>("");
  const [calendarAccessToken, setCalendarAccessToken] = useState<string>("");
  const [calendarRefreshToken, setCalendarRefreshToken] = useState<string>("");

  return (
    <div className="flex justify-center h-screen w-full p-8">
      <Toaster />
      <div className="flex justify-center flex-col space-y-4 max-w-[800px] max-h-[800px] w-full p-4 mx-auto">
        <Card className="flex flex-col justify-center align-middle space-y-4 max-w-[auto] p-4 w-full mx-auto">
          <p className="text-base font-semibold">OpenAI API Key:</p>
          <Input
            onChange={(e) => setOpenAiKey(e.target.value)}
            value={openAiKey}
            placeholder="Enter your OpenAI API key"
          />
          <p className="text-base font-semibold">Calendar Access Token:</p>
          <Input
            onChange={(e) => setCalendarAccessToken(e.target.value)}
            value={calendarAccessToken}
            placeholder="Enter your Calendar Access Token"
          />
          <p className="text-base font-semibold">Calendar Refresh Token:</p>
          <Input
            onChange={(e) => setCalendarRefreshToken(e.target.value)}
            value={calendarRefreshToken}
            placeholder="Enter your Calendar Refresh Token"
          />
          <Button
            onClick={() => {
              browser.storage.sync.set({ openAiKey: openAiKey });
              browser.storage.sync.set({
                calendarAccessToken: calendarAccessToken,
              });
              browser.storage.sync.set({
                calendarRefreshToken: calendarRefreshToken,
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
