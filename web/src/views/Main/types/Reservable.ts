export interface Reservable {
  id: number;
  legacy_id: string;
  parent_name: string;
  name: string;
  latitude: number;
  longitude: number;
  subparent_id?: string;
}
