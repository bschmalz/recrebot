import { delay } from '../utils/delay';
import dayjs from 'dayjs';
import { Reservable } from '../generated/graphql';

export const checkRecGovCamps = async (
  camps: Reservable[],
  days: any[],
  min_nights: number,
  memoFetch: () => Function,
  shortenDelay?: boolean,
  logError?: (message: string, error: Error) => void
) => {
  try {
    const memoRecGovCampCheck = memoFetch();
    const recdates = days.map((d) => dayjs(d));
    const result: {
      [key: string]: {
        url: string;
        dates: dayjs.Dayjs[];
        location: Reservable;
      };
    } = {};
    for (let c = 0; c < camps.length; c++) {
      const camp = camps[c];
      const monthsToCheck: { [key: string]: dayjs.Dayjs[] } = {};
      recdates.forEach((d) => {
        const yearMonth = `${d.year()}-${d.month()}}`;
        if (monthsToCheck[yearMonth]) monthsToCheck[yearMonth].push(d);
        else monthsToCheck[yearMonth] = [d];
      });

      for (let key in monthsToCheck) {
        const validDaysInMonth: { [key: string]: boolean } = {};
        const arr = monthsToCheck[key];
        const firstDay = arr[0].startOf('month').format('YYYY-MM-DD');
        const url = `https://www.recreation.gov/api/camps/availability/campground/${camp.legacy_id}/month?start_date=${firstDay}T00%3A00%3A00.000Z`;
        const curMonth = await memoRecGovCampCheck(url);
        (await shortenDelay) ? delay(123, 456) : delay();
        const nextMonthFirstDay = arr[0]
          .startOf('month')
          .add(1, 'month')
          .format('YYYY-MM-DD');

        const nextUrl = `https://www.recreation.gov/api/camps/availability/campground/${camp.legacy_id}/month?start_date=${nextMonthFirstDay}T00%3A00%3A00.000Z`;
        const nextMonth = await memoRecGovCampCheck(nextUrl);
        (await shortenDelay) ? delay(123, 456) : delay();

        let curStreak = 0;
        // Loop through every campsite on the response, make a map of previous nights of availability and then compare that to selections to
        // make a list of valid dates for the campground
        if (curMonth.campsites) {
          for (let key in curMonth.campsites) {
            const campsite = curMonth.campsites[key];
            const dates = Object.keys(campsite.availabilities);
            dates.forEach((d) => {
              if (campsite.availabilities[d] === 'Available') {
                curStreak++;
                if (curStreak >= min_nights) {
                  const newDate = dayjs(d)
                    .subtract(min_nights - 2, 'day')
                    .format('YYYY-MM-DD');
                  validDaysInMonth[newDate] = true;
                }
              } else {
                curStreak = 0;
              }
            });
            if (curStreak > 0 && min_nights > 1) {
              (await shortenDelay) ? delay(123, 456) : delay();

              const newCampsite = nextMonth?.campsites[key] || [];
              const newDates = Object.keys(newCampsite.availabilities);
              for (let i = 0; i < min_nights - 1; i++) {
                if (curStreak === 0) return;
                const d = dayjs(newDates[i]).add(1, 'day').date();
                if (
                  d === i + 1 &&
                  newCampsite.availabilities[newDates[i]] === 'Available'
                ) {
                  curStreak++;
                  const newDate = dayjs(newDates[i])
                    .subtract(min_nights - 2, 'day')
                    .format('YYYY-MM-DD');
                  validDaysInMonth[newDate] = true;
                } else {
                  curStreak = 0;
                }
              }
            }
          }
        }

        arr.forEach((d) => {
          const date = d.format('YYYY-MM-DD');
          if (validDaysInMonth[date]) {
            if (result[camp.name]) {
              result[camp.name].dates.push(d);
            } else {
              result[camp.name] = {
                location: camp,
                dates: [d],
                url: `https://www.recreation.gov/camping/campgrounds/${camp.legacy_id}`,
              };
            }
          }
        });
      }
    }
    return result;
  } catch (e) {
    if (logError) {
      logError('Error checking rec gov camps', e);
    }
    return {};
  }
};
