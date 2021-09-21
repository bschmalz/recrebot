import dayjs from 'dayjs';
import { Reservable } from '../views/Main/types/Reservable';
import { delay } from './delay';
import { memoFetch } from './memoFetch';

const reserveCaliUrl = 'https://calirdr.usedirect.com/rdr/rdr/search/place';

interface ReserveCaliRequest {
  Nights: number;
  IsADA: false;
  MinVehicleLength: null;
  UnitCategoryId: number;
  StartDate: string;
  Sort: string;
  CustomerId: number;
  NearbyCountLimit: number;
  CountUnits: true;
  PlaceId: number;
  NearbyOnlyAvailable: false;
  HighlightedPlaceId: number;
  UnitTypesGroupIds: [1];
  InSeasonOnly: false;
  SleepingUnitId: number;
  NearbyLimit: number;
  RefreshFavourites: true;
  RestrictADA: false;
  CountNearby: true;
  WebOnly: boolean;
}

const sampleBody: ReserveCaliRequest = {
  Nights: 1,
  IsADA: false,
  MinVehicleLength: null,
  UnitCategoryId: 1,
  StartDate: '2022-01-27',
  CustomerId: 0,
  Sort: 'distance',
  WebOnly: true,
  NearbyCountLimit: 10,
  CountUnits: true,
  PlaceId: 6,
  NearbyOnlyAvailable: false,
  UnitTypesGroupIds: [1],
  SleepingUnitId: 83,
  HighlightedPlaceId: 0,
  InSeasonOnly: false,
  NearbyLimit: 100,
  RefreshFavourites: true,
  RestrictADA: false,
  CountNearby: true,
};

const memoTrailheadCheck = memoFetch();
const memoRecGovCampCheck = memoFetch();

interface checkTrailheadsInterface {
  dates: Date[];
  locations: Reservable[];
}

interface checkCampgroundsInterface extends checkTrailheadsInterface {
  min_nights?: number;
}

interface checkTripRequestInterface extends checkCampgroundsInterface {
  type: string;
}

export const checkTripRequest = async ({
  dates,
  locations,
  min_nights,
  type,
}: checkTripRequestInterface) => {
  if (type === 'Hike') {
    return await checkTrailheads({ locations, dates });
  } else
    return await checkCampgrounds({ locations, dates, min_nights: min_nights });
};

const checkCampgrounds = async ({
  locations,
  dates,
  min_nights,
}: checkCampgroundsInterface) => {
  const datesToCheck = dates.map((d) => dayjs(d));
  // Group together campsites by type so we can batch our searches more easily
  const reserveCaliCamps: Reservable[] = [];
  const recGovCamps: Reservable[] = [];
  locations.forEach((loc) => {
    if (loc.sub_type === 'res_ca') {
      reserveCaliCamps.push(loc);
    } else {
      recGovCamps.push(loc);
    }
  });

  const reserveCaliCampResults = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/rc-check`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reserveCaliCamps, datesToCheck, min_nights }),
    }
  ).then((r) => r.json());

  for (let camp in reserveCaliCampResults) {
    reserveCaliCampResults[camp].dates = reserveCaliCampResults[camp].dates.map(
      (d) => dayjs(d)
    );
  }

  const recGovCampResults = await checkRecGovCamps(
    recGovCamps,
    datesToCheck,
    min_nights
  );

  return { ...reserveCaliCampResults, ...recGovCampResults };
};

const checkRecGovCamps = async (
  camps: Reservable[],
  recdates: dayjs.Dayjs[],
  min_nights: number
) => {
  const result = {};
  for (const camp of camps) {
    const monthsToCheck = {};
    recdates.forEach((d) => {
      const yearMonth = `${d.year()}-${d.month()}}`;
      if (monthsToCheck[yearMonth]) monthsToCheck[yearMonth].push(d);
      else monthsToCheck[yearMonth] = [d];
    });

    for (let key in monthsToCheck) {
      const validDaysInMonth = {};
      const arr = monthsToCheck[key];
      const firstDay = arr[0].startOf('month').format('YYYY-MM-DD');
      const url = `https://www.recreation.gov/api/camps/availability/campground/${camp.legacy_id}/month?start_date=${firstDay}T00%3A00%3A00.000Z`;
      const curMonth = await memoRecGovCampCheck(url);
      await delay();
      const nextMonthFirstDay = arr[0]
        .startOf('month')
        .add(1, 'month')
        .format('YYYY-MM-DD');

      const nextUrl = `https://www.recreation.gov/api/camps/availability/campground/${camp.legacy_id}/month?start_date=${nextMonthFirstDay}T00%3A00%3A00.000Z`;
      const nextMonth = await memoRecGovCampCheck(nextUrl);
      await delay();

      let curStreak = 0;
      // Loop through every campsite on the response, make a map of previous nights of availability and then compare that to selections to
      // make a list of valid dates for the campground
      const keys = Object.keys(curMonth?.campsites) || [];
      for (let key in keys) {
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
          await delay();
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
};

const checkTrailheads = async ({
  locations,
  dates,
}: checkTrailheadsInterface) => {
  const datesToCheck = dates.map((d) => dayjs(d));
  const monthsToCheck = {};
  const results = {};
  datesToCheck.forEach((d) => {
    const yearMonth = `${d.year()}-${d.month()}}`;
    if (monthsToCheck[yearMonth]) monthsToCheck[yearMonth].push(d);
    else monthsToCheck[yearMonth] = [d];
  });
  for (let key in monthsToCheck) {
    const arr = monthsToCheck[key];
    const firstDay = arr[0].startOf('month').format('YYYY-MM-DD');
    const lastDay = arr[0].endOf('month').format('YYYY-MM-DD');
    for (const loc of locations) {
      const url = `https://www.recreation.gov/api/permitinyo/${loc.subparent_id}/availability?start_date=${firstDay}&end_date=${lastDay}&commercial_acct=false`;
      const res = await memoTrailheadCheck(url);

      arr.forEach((d) => {
        const date = d.format('YYYY-MM-DD');
        if (res?.payload[date]) {
          const d = res.payload[date];
          if (d[loc.legacy_id]?.remaining) {
            if (results[loc.name]) {
              results[loc.name].dates.push(d);
            } else {
              results[loc.name] = {
                location: loc,
                dates: [d],
                url: `https://www.recreation.gov/permits/${loc.subparent_id}/registration/detailed-availability?type=overnight-permit&date=${date}`,
              };
            }
          }
        }
      });

      await delay();
    }
  }
  return results;
};
