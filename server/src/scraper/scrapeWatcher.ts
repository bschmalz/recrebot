import { getConnection, getRepository } from 'typeorm';
import { TripRequest } from '../entities/TripRequest';
import { checkTripRequest } from './checkTripRequest';
import { Reservable } from './types/Reservable';
import { User } from '../entities/User';
import { sendSuccessEmail } from '../utils/sendEmail';
import dayjs from 'dayjs';
import { sendSMS } from '../utils/sendSMS';
import Redis from 'ioredis';
import { getLocations } from './getLocations';

export interface TripRequestInterface {
  id: number;
  userId: number;
  active: boolean;
  custom_name: string;
  type: string;
  dates: string[];
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

export const scrapeWatcher = async (redis: Redis.Redis) => {
  intervalScrape(redis);
};

const fiveMins = 1000 * 60 * 5;

interface TRWithDates {
  dates: Date[];
  id: number;
  last_success?: Date;
  type: string;
  locations: number[];
  userId: number;
  active: boolean;
  custom_name: string;
  min_nights?: number;
  num_hikers?: number;
  created_at: Date;
  updated_at: Date;
}

const intervalScrape = async (redis: Redis.Redis) => {
  console.log('Beginning interval scrape');
  const now = dayjs();
  const trs = await getRepository(TripRequest).createQueryBuilder().getMany();
  for (let i = 0; i < trs.length; i++) {
    let tr = trs[i];
    const filteredDates = tr.dates.filter((d) => dayjs(d).isAfter(now));
    // In this case, our trip request has an old date that needs to be cleaned up
    if (filteredDates.length !== tr.dates.length) {
      if (!filteredDates.length) {
        await TripRequest.delete({ id: tr.id });
        continue;
      } else {
        // Remove old dates
        tr.dates = filteredDates;
        if (tr) {
          await TripRequest.save(tr);
        }
      }
    }

    // If we've successfully scraped this in the past 24 hours, we don't want to do it again
    if (tr.last_success) {
      const then = dayjs(tr.last_success);
      const diff = now.diff(then, 'day', true);
      if (diff <= 1) continue;
    }
    const locations: Reservable[] = await getLocations(
      tr.type,
      tr.locations,
      redis
    );

    const tripRequest: TripRequestInterface = {
      ...tr,
      locations,
    };

    const result: ScrapeResult | {} = await checkTripRequest(tripRequest);
    if (Object.keys(result).length)
      handleSuccessfulTripRequest(tripRequest, result);
  }
  // Scrape every 5 mins
  setTimeout(() => intervalScrape(redis), fiveMins);
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
    var isNumber = new RegExp('^[0-9]*$');
    if (user.phone?.length === 10 && isNumber.test(user.phone))
      sendSMS(user.phone);
  } else {
    console.error(
      'Found a trip request connected to a user that does not exist'
    );
  }
};

const returnTrue = async (tr: TripRequestInterface) => {
  await getConnection()
    .createQueryBuilder()
    .update(TripRequest)
    .set({ last_success: new Date() })
    .where('id = :id', { id: tr.id })
    .execute();
  return true;
};

const checkTripRequestStatus = async (tr: TripRequestInterface) => {
  const tripRequest = await TripRequest.findOne({ where: { id: tr.id } });

  if (tripRequest) {
    const lastSucces = tripRequest.last_success;
    if (!lastSucces) {
      return returnTrue(tr);
    } else {
      // Check to make sure we haven't sent a success email in the last day, just in case we missed it on our other check
      const now = dayjs();
      const then = dayjs(lastSucces);
      const diff = now.diff(then, 'day', true);
      if (diff > 1) {
        return returnTrue(tr);
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
};
