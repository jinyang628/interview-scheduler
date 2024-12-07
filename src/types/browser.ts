import { z } from "zod";

export const extractHtmlResponseSchema = z.object({
  html: z.string(),
});

export type ExtractHtmlResponse = z.infer<typeof extractHtmlResponseSchema>;

export const invokeMessageRequestSchema = z.object({
  prompt: z.string(),
});
