export interface Campground {
  legacy_id: string;
  recarea_name: string;
  name: string;
  longitude: number;
  latitude: number;
  source: string;
}

export interface Campgrounds {
  [key: string]: Campground;
}
