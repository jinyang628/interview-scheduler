import { CalendarEvent, TimeslotValidity } from '@/types/calendar/base';

export default async function rescheduleCalendarEvent(
  event: CalendarEvent,
  calendarEventValidity: TimeslotValidity,
) {
  //   const startDateBoundary = new Date(startDate.getTime() - 12 * 60 * 60 * 1000);
  //   const endDateBoundary = new Date(endDate.getTime() + 12 * 60 * 60 * 1000);
  //   const events: CalendarEvent[] = await getCalendarEvents({ startDateBoundary, endDateBoundary });
  // =  if (currentDate >= startDate) {
  //     const newlyProposedCalendarEvent: CalendarEvent = await rescheduleInterview({
  //       rescheduleReason: calendarEventValiditySchema.Values.currentDatePastStartDate,
  //       initialEvent: event,
  //       startDateBoundary,
  //       endDateBoundary,
  //     });
  //     throw new CurrentDatePastStartDateError(
  //       'Current date is not within the time slot. Proposing to reschedule the interview...',
  //       newlyProposedCalendarEvent,
  //     );
  //   }
}
