export interface ReserveCaliRequest {
  Nights: number;
  IsADA: false;
  MinVehicleLength: null;
  UnitCategoryId: number;
  StartDate: string;
  Sort: string;
  CustomerId: number;
  NearbyCountLimit: number;
  CountUnits: true;
  PlaceId: number;
  NearbyOnlyAvailable: false;
  HighlightedPlaceId: number;
  UnitTypesGroupIds: [1];
  InSeasonOnly: false;
  SleepingUnitId: number;
  NearbyLimit: number;
  RefreshFavourites: true;
  RestrictADA: false;
  CountNearby: true;
  WebOnly: boolean;
}

export interface CaliCampResponse {
  PlaceId: number;
}
