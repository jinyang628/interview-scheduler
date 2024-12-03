import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function App() {
  const [openAiKey, setOpenAiKey] = useState<string>("");

  return (
    <div className="flex justify-center h-screen w-full p-8">
      <div className="flex justify-center flex-col space-y-4 max-w-[800px] max-h-[800px] w-full p-4 mx-auto">
        <Card className="flex flex-col justify-center align-middle space-y-4 max-w-[auto] p-4 w-full mx-auto">
          <p className="text-base font-semibold">OpenAI API Key:</p>
          <Input
            onChange={(e) => setOpenAiKey(e.target.value)}
            value={openAiKey}
            placeholder="Enter your OpenAI API key"
          />
          <Button
            onClick={() => {
              browser.storage.sync.set({ openAiKey: openAiKey });
            }}
          >
            Save
          </Button>
        </Card>
      </div>
    </div>
  );
}
