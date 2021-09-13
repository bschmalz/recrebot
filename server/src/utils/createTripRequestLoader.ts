import DataLoader from 'dataloader';
import { TripRequest } from '../entities/TripRequest';

export const createTripRequestLoader = () =>
  new DataLoader<{ userId: number }, TripRequest | null>(async (keys) => {
    const tripRequests = await TripRequest.findByIds(keys as any);
    const tripRequestIdsToTripRequest: Record<string, TripRequest> = {};
    tripRequests.forEach((tripRequest) => {
      tripRequestIdsToTripRequest[tripRequest.userId] = tripRequest;
    });
    console.log('trip requests', tripRequests);

    return keys.map((key) => tripRequestIdsToTripRequest[key.userId]);
  });
