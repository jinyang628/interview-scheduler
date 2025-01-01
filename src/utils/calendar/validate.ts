import getCalendarEvents from '@/utils/calendar/get';

import { CalendarEvent, Timeslot } from '@/types/calendar/base';
import { TimeslotValidity, timeslotValiditySchema } from '@/types/calendar/validate';

type ValidateTimeslotProps = {
  timeslot: Timeslot;
};
export default async function validateTimeslot({
  timeslot,
}: ValidateTimeslotProps): Promise<TimeslotValidity> {
  const startDate = new Date(timeslot.start.dateTime);
  const endDate = new Date(timeslot.end.dateTime);
  const currentDate = new Date();

  if (endDate <= startDate) {
    return timeslotValiditySchema.Values.endDateBeforeStartDate;
  }

  if (currentDate >= startDate) {
    return timeslotValiditySchema.Values.currentDatePastStartDate;
  }

  const events: CalendarEvent[] = await getCalendarEvents({
    startDateBoundary: startDate,
    endDateBoundary: endDate,
  });

  if (events.length > 0) {
    return timeslotValiditySchema.Values.booked;
  }

  return timeslotValiditySchema.Values.valid;
}