import { EXTRACT_HTML_ACTION, INVOKE_ACTION } from '@/constants/browser';
import { extractEmail } from '@/utils/email';

import { Button } from '@/components/ui/button';

import { extractHtmlResponseSchema, invokeRequestSchema } from '@/types/browser';
import { Message } from '@/types/email';

import '@/styles/globals.css';

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

    const input = invokeRequestSchema.parse({
      messages: messages,
    });
    await browser.runtime.sendMessage({
      action: INVOKE_ACTION,
      input: input,
    });
    console.log(messages);
  };

  return (
    // This should be the only container with hard coded width and height
    <div className="flex h-[200px] w-[200px] flex-col items-center justify-center space-y-5">
      <Button onClick={extractHtml}>Book Meeting!</Button>
    </div>
  );
}
