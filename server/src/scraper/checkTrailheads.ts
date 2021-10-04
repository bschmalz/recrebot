import { Reservable } from './types/Reservable';
import { delay } from '../utils/delay';
import dayjs from 'dayjs';

interface checkTrailheadsInterface {
  dates: Date[];
  locations: Reservable[];
  memoFetch: () => Function;
  shortenDelay?: boolean;
}

export const checkTrailheads = async ({
  locations,
  dates,
  memoFetch,
  shortenDelay = false,
}: checkTrailheadsInterface) => {
  try {
    const memoTrailheadCheck = memoFetch();

    const datesToCheck = dates.map((d) => dayjs(d));
    const monthsToCheck: { [key: string]: dayjs.Dayjs[] } = {};
    const results: {
      [key: string]: {
        url: string;
        dates: dayjs.Dayjs[];
        location: Reservable;
      };
    } = {};
    datesToCheck.forEach((d) => {
      const yearMonth = `${d.year()}-${d.month()}}`;
      if (monthsToCheck[yearMonth]) monthsToCheck[yearMonth].push(d);
      else monthsToCheck[yearMonth] = [d];
    });
    for (let key in monthsToCheck) {
      const arr = monthsToCheck[key];
      const firstDay = arr[0].startOf('month').format('YYYY-MM-DD');
      const lastDay = arr[0].endOf('month').format('YYYY-MM-DD');
      for (let x = 0; x < locations.length; x++) {
        const loc = locations[x];
        const url = `https://www.recreation.gov/api/permitinyo/${loc.subparent_id}/availability?start_date=${firstDay}&end_date=${lastDay}&commercial_acct=false`;
        const res = await memoTrailheadCheck(url);
        for (let i = 0; i < arr.length; i++) {
          const date = arr[i].format('YYYY-MM-DD');
          if (res?.payload[date]) {
            const d = res.payload[date];
            if (d[loc.legacy_id]?.remaining) {
              if (results[loc.name]) {
                results[loc.name].dates.push(arr[i]);
              } else {
                results[loc.name] = {
                  location: loc,
                  dates: [arr[i]],
                  url: `https://www.recreation.gov/permits/${
                    loc.subparent_id
                  }/registration/detailed-availability?type=overnight-permit&date=${arr[
                    i
                  ].format('YYYY-MM-DD')}2021-09-16`,
                };
              }
            }
          }
        }
        (await shortenDelay) ? delay(123, 456) : delay();
      }
    }
    return results;
  } catch (e) {
    console.log('error checking trailhead trip request');
    return {};
  }
};
