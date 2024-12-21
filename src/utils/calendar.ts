import { logger } from "@/lib/logger";
import { google } from "googleapis";

export interface CalendarEvent {
  summary: string;
  description?: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

export async function createCalendarEvent(
  apiKey: string,
  event: CalendarEvent,
): Promise<string> {
  const calendar = google.calendar({
    version: "v3",
    auth: apiKey,
  });

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    return response.data.id || "";
  } catch (error) {
    logger.error("Error creating calendar event:", error as Error);
    throw error;
  }
}
