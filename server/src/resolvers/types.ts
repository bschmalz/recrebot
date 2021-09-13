import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class SearchInput {
  @Field()
  searchTerm: string;

  @Field({ nullable: true })
  mapCenter: string;

  @Field({ nullable: true })
  mapBounds: string;

  @Field({ nullable: true })
  filterOnBounds: boolean;
}

@InputType()
export class TripRequestInput {
  @Field()
  custom_name: string;

  @Field()
  type: string;

  @Field(() => [Date])
  dates: Date[];

  @Field(() => [Int])
  locations: number[];

  @Field({ nullable: true })
  min_nights: number;
}

export interface handleSearchInterface {
  searchTerm: string;
  maxLng: number;
  minLng: number;
  maxLat: number;
  minLat: number;
  lng: number;
  lat: number;
  locationSearch: boolean;
  orderByCenter: boolean;
  textSearch: boolean;
}
