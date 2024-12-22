import { z } from 'zod';

export const messageSchema = z.object({
  name: z.string(),
  email: z.string(),
  content: z.string(),
});

export type Message = z.infer<typeof messageSchema>;
