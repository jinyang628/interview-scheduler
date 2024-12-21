import { logger } from "@/lib/logger";
import { google } from "googleapis";

export interface CalendarEvent {
  summary: string;
  description?: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

export async function createCalendarEvent(
  event: CalendarEvent,
): Promise<string> {
  let apiKey: string = "";
  const result = await browser.storage.sync.get("calendarKey");
  if (result.calendarKey) {
    apiKey = result.calendarKey;
  }
  if (!apiKey) {
    throw new Error("No Google Calendar API key found");
  }
  const calendar = google.calendar({
    version: "v3",
    auth: apiKey,
  });

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    if (!response.data.id) {
      throw new Error("No google calendar event ID found");
    }

    return response.data.id;
  } catch (error) {
    logger.error("Error creating calendar event:", error as Error);
    throw error;
  }
}
