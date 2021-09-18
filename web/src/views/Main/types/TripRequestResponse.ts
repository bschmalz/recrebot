import { Reservable } from './Reservable';
type Location = {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  parent_name: string;
};

export interface TripRequestResponse {
  custom_name: string;
  dates: Date[];
  locations: Location[];
  min_nights?: number;
  id: number;
  type: string;
}
