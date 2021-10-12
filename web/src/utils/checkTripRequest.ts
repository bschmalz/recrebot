import axios from 'axios';
import dayjs from 'dayjs';
import { checkRecGovCamps } from './checkRecGovCamps';
import { checkTrailheads } from './checkTrailheads';
import { memoFetch } from './memoFetch';

const shortenDelay = true;

interface checkTrailheadsInterface {
  dates: Date[];
  locations: any[];
  num_hikers?: number;
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
  num_hikers,
}: checkTripRequestInterface) => {
  if (type === 'Hike') {
    return await checkTrailheads({
      locations,
      dates,
      memoFetch,
      shortenDelay,
      num_hikers,
    });
  } else return await checkCampgrounds({ locations, dates, min_nights });
};

const checkCampgrounds = async ({
  locations,
  dates,
  min_nights,
}: checkCampgroundsInterface) => {
  // Group together campsites by type so we can batch our searches more easily
  const reserveCaliCamps: any[] = [];
  const recGovCamps: any[] = [];
  locations.forEach((loc) => {
    if (loc.sub_type === 'res_ca') {
      reserveCaliCamps.push(loc);
    } else {
      recGovCamps.push(loc);
    }
  });

  const reserveCaliCampResults = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/rc-check`,
    { reserveCaliCamps, dates, min_nights }
  );

  const caliResults = reserveCaliCampResults.data;

  for (let camp in caliResults) {
    caliResults[camp].dates = caliResults[camp].dates.map((d) => dayjs(d));
  }

  const recGovCampResults = await checkRecGovCamps(
    recGovCamps,
    dates,
    min_nights,
    memoFetch,
    shortenDelay
  );

  return { ...caliResults, ...recGovCampResults };
};
