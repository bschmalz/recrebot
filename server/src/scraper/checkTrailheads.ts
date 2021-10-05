import { Reservable } from './types/Reservable';
import { delay } from '../utils/delay';
import dayjs from 'dayjs';

interface CheckTrailheadsInterface {
  dates: Date[];
  locations: Reservable[];
  memoFetch: () => Function;
  shortenDelay?: boolean;
  num_hikers: number;
  logError?: (message: string, error: Error) => void;
}

export const checkTrailheads = async ({
  locations,
  dates,
  memoFetch,
  shortenDelay = false,
  num_hikers,
  logError,
}: CheckTrailheadsInterface) => {
  const backcountryTrails: Reservable[] = [];
  const permitTrails: Reservable[] = [];
  locations.forEach((loc) => {
    if (loc.subparent_id === '233260') {
      permitTrails.push(loc);
    } else {
      backcountryTrails.push(loc);
    }
  });

  const backcountryResults = await checkBackcountryTrailheads({
    locations: backcountryTrails,
    dates,
    memoFetch,
    shortenDelay,
    num_hikers,
    logError,
  });

  const permitResults = await checkPermitTrailheads({
    locations: permitTrails,
    dates,
    memoFetch,
    num_hikers,
    logError,
  });

  return { ...backcountryResults, ...permitResults };
};

const getSearchObjects = (dates: Date[]) => {
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

  return { monthsToCheck, results };
};

const checkBackcountryTrailheads = async ({
  locations,
  dates,
  memoFetch,
  shortenDelay = false,
  num_hikers,
  logError,
}: CheckTrailheadsInterface) => {
  try {
    const memoTrailheadCheck = memoFetch();

    const { monthsToCheck, results } = getSearchObjects(dates);

    for (let key in monthsToCheck) {
      const arr = monthsToCheck[key];
      const firstDay = arr[0].startOf('month').format('YYYY-MM-DD');
      const lastDay = arr[0].endOf('month').format('YYYY-MM-DD');
      for (let x = 0; x < locations.length; x++) {
        // Whitney search is hardcoded based on ID for now, will change as new locations define requirements
        const loc = locations[x];
        const url = `https://www.recreation.gov/api/permitinyo/${loc.subparent_id}/availability?start_date=${firstDay}&end_date=${lastDay}&commercial_acct=false`;
        const res = await memoTrailheadCheck(url);
        for (let i = 0; i < arr.length; i++) {
          const date = arr[i].format('YYYY-MM-DD');
          if (res?.payload[date]) {
            const d = res.payload[date];
            if (d[loc.legacy_id]?.remaining >= num_hikers) {
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
    if (logError) {
      logError('Error checking backcountry trail permit', e);
    }
    return {};
  }
};

const today = dayjs().format('YYYY-MM-DDT00:00:00Z');
const nextYear = dayjs().add(1, 'year').format('YYYY-MM-DDT00:00:00Z');

const checkPermitTrailheads = async ({
  locations,
  dates,
  memoFetch,
  shortenDelay = false,
  num_hikers,
  logError,
}: CheckTrailheadsInterface) => {
  console.log('num hikers', num_hikers);

  try {
    const memoTrailheadCheck = memoFetch();
    const results: {
      [key: string]: {
        url: string;
        dates: dayjs.Dayjs[];
        location: Reservable;
      };
    } = {};

    const datesToCheck = dates.map((d) => dayjs(d));

    for (let i = 0; i < locations.length; i++) {
      const loc = locations[i];
      const res = await memoTrailheadCheck(
        `https://www.recreation.gov/api/permits/${loc.subparent_id}/divisions/${loc.legacy_id}/availability?start_date=${today}&end_date=${nextYear}&commercial_acct=false`
      );

      datesToCheck.forEach((d) => {
        const remaining =
          res?.payload?.date_availability[`${d.format('YYYY-MM-DD')}T00:00:00Z`]
            ?.remaining;
        if (remaining && remaining >= num_hikers) {
          if (results[loc.name]) {
            results[loc.name].dates.push(d);
          } else {
            results[loc.name] = {
              location: loc,
              dates: [d],
              url: `https://www.recreation.gov/permits/${
                loc.subparent_id
              }/registration/detailed-availability?type=overnight-permit&date=${d.format(
                'YYYY-MM-DD'
              )}`,
            };
          }
        }
      });

      (await shortenDelay) ? delay(123, 456) : delay();
    }
    return results;
  } catch (e) {
    if (logError) {
      logError('Error checking permit trip request', e);
    }
    return {};
  }
};
