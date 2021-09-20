import { getRepository } from 'typeorm';
import { TripRequest } from '../entities/TripRequest';

export const scrapeWatcher = async () => {
  // setInterval(intervalScrape, 1000 * 60 * 5);
  intervalScrape();
};

const intervalScrape = async () => {
  const trs = await getRepository(TripRequest).createQueryBuilder().getMany();
  trs.forEach((tr) => {
    console.log('tr', tr);
  });
};
