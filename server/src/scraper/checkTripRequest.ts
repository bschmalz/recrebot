import dayjs from 'dayjs';
import { memoFetch } from '../utils/memoFetch';
import fetch from 'node-fetch';

import { delay } from './delay';
import { Reservable } from './types/Reservable';
import { Trailhead } from 'src/entities/Trailhead';

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

interface CaliCampResponse {
  PlaceId: number;
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
  min_nights: number;
}

interface checkTripRequestInterface {
  type: string;
  min_nights?: number | undefined;
  dates: Date[];
  locations: Reservable[];
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
    return await checkCampgrounds({
      locations,
      dates,
      min_nights: min_nights || 1,
    });
};

const checkCampgrounds = async ({
  locations,
  dates,
  min_nights,
}: checkCampgroundsInterface) => {
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
  const reserveCaliCampResults = await checkCaliCamps(
    reserveCaliCamps,
    dates,
    min_nights
  );
  const recGovCampResults = await checkRecGovCamps(
    recGovCamps,
    dates,
    min_nights
  );

  return { ...reserveCaliCampResults, ...recGovCampResults };
};

export const checkCaliCamps = async (
  camps: Reservable[],
  days: Date[],
  min_nights: number
) => {
  const dates = days.map((d) => dayjs(d));
  const result: {
    [key: string]: { dates: dayjs.Dayjs[]; url: string; location: Reservable };
  } = {};
  for (let c = 0; c < camps.length; c++) {
    const camp = camps[c];
    for (let d = 0; d < dates.length; d++) {
      const date = dates[d];
      const req = {
        ...sampleBody,
        Nights: min_nights,
        PlaceId: camp.legacy_id,
        StartDate: date.format('YYYY-MM-DD'),
      };
      const res = await fetch(reserveCaliUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      }).then((r) => r.json());
      await delay(123, 456);
      const facilities = res?.SelectedPlace?.Facilities || {};
      for (let key in facilities) {
        const f = facilities[key];
        if (f.Available) {
          if (result[camp.name]) {
            if (!result[camp.name].dates.includes(date))
              result[camp.name].dates.push(date);
          } else {
            result[camp.name] = {
              location: camp,
              dates: [date],
              url: 'https://www.reservecalifornia.com/CaliforniaWebHome/Facilities/SearchViewUnitAvailabity.aspx',
            };
          }
        }
      }
    }
  }
  return result;
};

const checkRecGovCamps = async (
  camps: Reservable[],
  days: any[],
  min_nights: number
) => {
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
  const monthsToCheck: { [key: string]: dayjs.Dayjs[] } = {};
  const results: {
    [key: string]: { url: string; dates: dayjs.Dayjs[]; location: Reservable };
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
      await delay();
    }
  }
  return results;
};
