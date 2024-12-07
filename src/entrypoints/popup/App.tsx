import { Button } from "@/components/ui/button";
import { EXTRACT_HTML_ACTION, INVOKE_ACTION } from "@/constants/browser";
import "@/styles/globals.css";
import {
  extractHtmlResponseSchema,
  invokeMessageRequestSchema,
} from "@/types/browser";
import { Message } from "@/types/email";
import { extractEmail } from "@/utils/email";

export default function App() {
  const extractHtml = async () => {
    // Get the active tab
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });

    const response = extractHtmlResponseSchema.parse(
      await browser.tabs.sendMessage(tab.id!, {
        action: EXTRACT_HTML_ACTION,
      }),
    );
    const messages: Message[] = extractEmail(response.html);

    const invokeMessageInput = invokeMessageRequestSchema.parse({
      prompt: "Write a haiku about programming",
    });
    await browser.runtime.sendMessage({
      action: INVOKE_ACTION,
      input: invokeMessageInput,
    });
    console.log(messages);
  };

  return (
    // This should be the only container with hard coded width and height
    <div className="flex flex-col items-center justify-center w-[200px] h-[200px] space-y-5">
      <Button onClick={extractHtml}>Book Meeting!</Button>
    </div>
  );
}
