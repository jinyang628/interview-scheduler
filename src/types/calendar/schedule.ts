import { z } from 'zod';

export const scheduleEventResponseSchema = z.object({
  reply: z.string(),
  eventUrl: z.string(),
});

export type ScheduleEventResponse = z.infer<typeof scheduleEventResponseSchema>;

export const validTimeSlotResponseSchema = z.object({
  summary: z.string().describe('The one-line title of the calendar event'),
  description: z
    .string()
    .describe(
      'The details of the interview such as the microsoft/zoom/google meeting link, hackerrank/codepair link, nature of the interview (if any), etc.',
    ),
  reply: z.string().describe('The reply to the sender acknowledging attendance of the interview'),
});

export type ValidTimeSlotResponse = z.infer<typeof validTimeSlotResponseSchema>;

type EmailReplyProps = {
  recipient: string;
  content: string;
};

export const EMAIL_CONTENT = ({ recipient, content }: EmailReplyProps) => `Dear ${recipient},

${content}`;

export const EMAIL_REPLY_TEMPLATE = (content: string, name: string) => `${content}

Best regards,
${name}`;
