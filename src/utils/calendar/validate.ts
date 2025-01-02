import getCalendarEvents from '@/utils/calendar/get';

import { CalendarEvent, Timeslot } from '@/types/calendar/base';
import { PreferredTimeslots } from '@/types/calendar/preference';
import { TimeslotValidity, timeslotValiditySchema } from '@/types/calendar/validate';

type ValidateTimeslotProps = {
  proposedTimeslot: Timeslot;
  preferredTimeslots: PreferredTimeslots;
};

// function proposedTimeslotIsWithinPreferredTimeslots({
//   proposedTimeslot,
//   preferredTimeslots,
// }): boolean {

// }

export default async function validateTimeslot({
  proposedTimeslot,
  preferredTimeslots,
}: ValidateTimeslotProps): Promise<TimeslotValidity> {
  const startDate = new Date(proposedTimeslot.start.dateTime);
  const endDate = new Date(proposedTimeslot.end.dateTime);
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

  if (
    !preferredTimeslots.earliestStartTime ||
    !preferredTimeslots.latestEndTime ||
    !preferredTimeslots.timezone ||
    preferredTimeslots.preferredDays.length === 0
  ) {
    console.log('Preferred timeslots are not set', preferredTimeslots);
    return timeslotValiditySchema.Values.valid;
  }

  // return;
  return timeslotValiditySchema.Values.valid;
}
