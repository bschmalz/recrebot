import dayjs from 'dayjs';
import { Reservable } from '../views/Main/types/Reservable';
import { checkRecGovCamps } from '../../../../recreBot/server/src/scraper/checkRecGovCamps';
import { checkTrailheads } from '../../../../recreBot/server/src/scraper/checkTrailheads';
import { memoFetch } from './memoFetch';

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
    return await checkTrailheads({ locations, dates, memoFetch });
  } else return await checkCampgrounds({ locations, dates, min_nights });
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

  const reserveCaliCampResults = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/rc-check`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reserveCaliCamps, dates, min_nights }),
    }
  ).then((r) => r.json());

  for (let camp in reserveCaliCampResults) {
    reserveCaliCampResults[camp].dates = reserveCaliCampResults[camp].dates.map(
      (d) => dayjs(d)
    );
  }

  const recGovCampResults = await checkRecGovCamps(
    recGovCamps,
    dates,
    min_nights,
    memoFetch
  );

  return { ...reserveCaliCampResults, ...recGovCampResults };
};
