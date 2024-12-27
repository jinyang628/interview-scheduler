import { z } from 'zod';

export const scheduleEventResponseSchema = z.object({
  reply: z.string(),
  eventUrl: z.string(),
});

export type ScheduleEventResponse = z.infer<typeof scheduleEventResponseSchema>;


type EmailReplyProps = {
  recipient: string;
  content: string;
}

export const EMAIL_CONTENT = ({ recipient, content }: EmailReplyProps) => `Dear ${recipient},

${content}`;


export const EMAIL_REPLY_TEMPLATE = (content: string, name: string) => `${content}

Best regards,
${name}`
