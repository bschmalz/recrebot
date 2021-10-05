import dayjs from 'dayjs';
import fetch from 'node-fetch';
import { delay } from '../utils/delay';
import { checkRecGovCamps } from './checkRecGovCamps';
import { checkTrailheads } from './checkTrailheads';
import { Reservable } from './types/Reservable';
import { memoFetch } from '../utils/memoFetch';
import { logError } from '../utils/logError';

const reserveCaliUrl = 'https://calirdr.usedirect.com/rdr/rdr/search/place';

const startDate = dayjs().format('YYYY-MM-DD');

export const sampleCaliReqBody = {
  Nights: 1,
  IsADA: false,
  MinVehicleLength: null,
  UnitCategoryId: 1,
  StartDate: startDate,
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

interface checkCampgroundsInterface {
  min_nights: number;
  dates: Date[];
  locations: Reservable[];
  logError?: (message: string, error: Error) => void;
}

interface checkTripRequestInterface {
  type: string;
  min_nights?: number | undefined;
  dates: Date[];
  locations: Reservable[];
  num_hikers?: number | undefined;
}

export const checkTripRequest = async ({
  dates,
  locations,
  min_nights,
  type,
  num_hikers,
}: checkTripRequestInterface) => {
  if (type === 'Hike') {
    return await checkTrailheads({
      locations,
      dates,
      memoFetch,
      num_hikers: num_hikers || 1,
      logError,
    });
  } else
    return await checkCampgrounds({
      locations,
      dates,
      min_nights: min_nights || 1,
      logError,
    });
};

const checkCampgrounds = async ({
  locations,
  dates,
  min_nights,
  logError,
}: checkCampgroundsInterface) => {
  try {
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
      min_nights,
      memoFetch
    );

    return { ...reserveCaliCampResults, ...recGovCampResults };
  } catch (e) {
    if (logError) {
      logError('Error collecting camps', e);
    }
    return {};
  }
};

export const checkCaliCamps = async (
  camps: Reservable[],
  days: Date[],
  min_nights: number
) => {
  try {
    const dates = days.map((d) => dayjs(d));
    const result: {
      [key: string]: {
        dates: dayjs.Dayjs[];
        url: string;
        location: Reservable;
      };
    } = {};
    for (let c = 0; c < camps.length; c++) {
      const camp = camps[c];
      for (let d = 0; d < dates.length; d++) {
        const date = dates[d];
        const req = {
          ...sampleCaliReqBody,
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
  } catch (e) {
    // console.log('error checking cali camps', e);
    if (logError) {
      logError('error checking cali camps', e);
    }
    return {};
  }
};
