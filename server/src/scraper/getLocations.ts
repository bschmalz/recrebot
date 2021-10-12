import { Campground } from '../entities/Campground';
import { Trailhead } from '../entities/Trailhead';
import { logError } from '../utils/logError';
import { getRepository } from 'typeorm';
import { CAMPGROUND_PREFIX, TRAILHEAD_PREFIX } from '../constants';
import Redis from 'ioredis';

// redis.set(FORGET_PASSWORD_PREFIX + token, user.id, 'ex', 1000 * 60 * 30);

export const getLocations = async (
  type: string,
  locations: number[],
  redis: Redis.Redis
) => {
  let result, key;
  try {
    if (type === 'Camp') {
      key = `${CAMPGROUND_PREFIX}${JSON.stringify(locations)}`;
      const cgs = await redis.get(key);
      if (cgs) return JSON.parse(cgs);
      result = await getRepository(Campground)
        .createQueryBuilder('campground')
        .where('campground.id IN (:...ids)', { ids: locations })
        .getMany();
      if (result && result.length)
        await redis.set(
          key,
          JSON.stringify(result),
          'ex',
          1000 * 60 * 60 * 24 * 7
        );
    } else {
      key = `${TRAILHEAD_PREFIX}${JSON.stringify(locations)}`;
      const ths = await redis.get(key);
      if (ths) return JSON.parse(ths);
      result = await getRepository(Trailhead)
        .createQueryBuilder('trailhead')
        .where('trailhead.id IN (:...ids)', { ids: locations })
        .getMany();

      if (result && result.length)
        await redis.set(
          key,
          JSON.stringify(result),
          'ex',
          1000 * 60 * 60 * 24 * 7
        );
    }
  } catch (e) {
    logError('Error grabbing locations from db from type ' + type, e);
  }
  return result || [];
};
