import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/stores/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserDataForm } from "@/components/options/user-data";
import { Card } from "@/components/ui/card";
import { SUPABASE_KEY, SUPABASE_URL } from "@/constants/supabase";

export default function App() {
  const [apiKey, setApiKey] = useState<string>("");
  const [supabaseKey, setSupabaseKey] = useState<string>(SUPABASE_KEY);
  const [supabaseUrl, setSupabaseUrl] = useState<string>(SUPABASE_URL);
  const [user, setUser] = useState<User | null>(null);
  const [openAiKey, setOpenAiKey] = useState<string>("");

  return (
    <div className="flex justify-center h-screen w-full p-8">
      <Tabs defaultValue="keys" className="w-[800px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
        </TabsList>
        <TabsContent className="flex justify-center" value="user">
          <UserDataForm />
        </TabsContent>
        <TabsContent value="keys">
          <div className="flex justify-center flex-col space-y-4 max-w-[800px] max-h-[800px] w-full p-4 mx-auto">
            <Card className="flex flex-col justify-center align-middle space-y-4 max-w-[auto] p-4 w-full mx-auto">
              <p className="text-base font-semibold">Anthropic API Key:</p>
              <Input
                onChange={(e) => setApiKey(e.target.value)}
                value={apiKey}
                placeholder="Enter your Anthropic API key"
              />
              <p className="text-base font-semibold">OpenAI API Key:</p>
              <Input
                onChange={(e) => setOpenAiKey(e.target.value)}
                value={openAiKey}
                placeholder="Enter your OpenAI API key"
              />
              <p className="text-base font-semibold">Supabase Key:</p>
              <Input
                onChange={(e) => setSupabaseKey(e.target.value)}
                value={supabaseKey}
                placeholder="Enter your Supabase key"
              />
              <p className="text-base font-semibold">Supabase URL:</p>
              <Input
                onChange={(e) => setSupabaseUrl(e.target.value)}
                value={supabaseUrl}
                placeholder="Enter your Supabase URL"
              />
              <Button
                onClick={() => {
                  browser.storage.sync.set({ apiKey: apiKey });
                  browser.storage.sync.set({ supabaseKey: supabaseKey });
                  browser.storage.sync.set({ supabaseUrl: supabaseUrl });
                  browser.storage.sync.set({ openAiKey: openAiKey });
                }}
              >
                Save
              </Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
