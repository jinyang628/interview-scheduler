import { Button } from "@/components/ui/button";
import { EXTRACT_HTML_ACTION } from "@/constants/browser";
import "@/styles/globals.css";
import { extractHtmlResponseSchema } from "@/types/browser";
import { Message } from "@/types/email";
import { extractEmail } from "@/utils/email";
import { generateText } from "@/utils/openai";

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
    const prompt = "Write a haiku about programming";
    generateText(prompt)
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    console.log(messages);
  };

  return (
    // This should be the only container with hard coded width and height
    <div className="flex flex-col items-center justify-center w-[200px] h-[200px] space-y-5">
      <Button onClick={extractHtml}>Book Meeting!</Button>
    </div>
  );
}
