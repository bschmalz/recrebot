import dayjs from 'dayjs';
import { checkRecGovCamps } from './checkRecGovCamps';
import { checkTrailheads } from './checkTrailheads';
import { Reservable } from './types/Reservable';
import { memoFetch } from '../utils/memoFetch';
import { logError } from '../utils/logError';
import { checkCaliCamps } from './checkCaliCamps';

const startDate = dayjs().format('YYYY-MM-DD');

export const sampleCaliReqBody = {
  Nights: '1',
  IsADA: false,
  MinVehicleLength: null,
  UnitCategoryId: 0,
  StartDate: startDate,
  CustomerId: 0,
  Sort: 'distance',
  WebOnly: true,
  NearbyCountLimit: 10,
  PlaceId: 6,
  NearbyOnlyAvailable: false,
  UnitTypesGroupIds: [],
  SleepingUnitId: 0,
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
