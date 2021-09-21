import { Campground } from '../entities/Campground';
import { Trailhead } from '../entities/Trailhead';
import { getConnection, getRepository } from 'typeorm';
import { TripRequest } from '../entities/TripRequest';
import { checkTripRequest } from './checkTripRequest';
import { Reservable } from './types/Reservable';
import { User } from '../entities/User';
import { sendSuccessEmail } from '../utils/sendEmail';
import dayjs from 'dayjs';

export interface TripRequestInterface {
  id: number;
  userId: number;
  active: boolean;
  custom_name: string;
  type: string;
  dates: Date[];
  locations: Reservable[];
  min_nights?: number;
  last_success: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface ScrapeResult {
  [key: string]: {
    location: Reservable;
    dates: Date[];
    url: string;
  };
}

export const scrapeWatcher = async () => {
  // setInterval(intervalScrape, 1000 * 60 * 5);
  intervalScrape();
};

const intervalScrape = async () => {
  const trs = await getRepository(TripRequest).createQueryBuilder().getMany();
  for (let i = 0; i < trs.length; i++) {
    const tr = trs[i];
    // If we've successfully scraped this in the past 24 hours, we don't want to do it again
    if (tr.last_success) {
      const now = dayjs();
      const then = dayjs(tr.last_success);
      const diff = now.diff(then, 'day', true);
      if (diff <= 1) continue;
    }

    let locations: Reservable[] = [];
    if (tr.type === 'Camp') {
      locations = await getRepository(Campground)
        .createQueryBuilder('campground')
        .where('campground.id IN (:...ids)', { ids: tr.locations })
        .getMany();
    } else {
      locations = await getRepository(Trailhead)
        .createQueryBuilder('trailhead')
        .where('trailhead.id IN (:...ids)', { ids: tr.locations })
        .getMany();
    }

    const tripRequest: TripRequestInterface = {
      ...tr,
      locations,
    };

    const result: ScrapeResult | {} = await checkTripRequest(tripRequest);
    if (Object.keys(result).length)
      handleSuccessfulTripRequest(tripRequest, result);
  }
};

const handleSuccessfulTripRequest = async (
  tr: TripRequestInterface,
  result: ScrapeResult
) => {
  const shouldSend = await checkTripRequestStatus(tr);
  if (!shouldSend) return;
  const user = await User.findOne({ where: { id: tr.userId } });
  if (user) {
    sendSuccessEmail(user.email, result);
  } else {
    console.error(
      'Found a trip request connected to a user that does not exist'
    );
  }
};

const checkTripRequestStatus = async (tr: TripRequestInterface) => {
  const tripRequest = await TripRequest.findOne({ where: { id: tr.id } });
  if (tripRequest) {
    const lastSucces = tripRequest.last_success;
    console.log('last Success', lastSucces);
    if (!lastSucces) {
      await getConnection()
        .createQueryBuilder()
        .update(TripRequest)
        .set({ last_success: new Date() })
        .where('id = :id', { id: tr.id })
        .execute();
      return true;
    } else {
      // Check to make sure we haven't sent a success email in the last day, just in case we missed it on our other check
      const now = dayjs();
      const then = dayjs(lastSucces);
      const diff = now.diff(then, 'day', true);
      return diff > 1;
    }
  } else {
    return false;
  }
};
