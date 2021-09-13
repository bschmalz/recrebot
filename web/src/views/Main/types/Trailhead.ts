import { Reservable } from './Reservable';

export interface Trailhead extends Reservable {
  district?: string;
  facility_id: string;
}
