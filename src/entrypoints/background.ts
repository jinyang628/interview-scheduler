import { INVOKE_ACTION } from "@/constants/browser";
import { invokeMessageRequestSchema } from "@/types/browser";
import { invoke } from "@/utils/openai";

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
      case INVOKE_ACTION:
        const input = invokeMessageRequestSchema.parse(message.input);
        invoke(input.prompt);
      default:
        break;
    }
    return true;
  });
});
