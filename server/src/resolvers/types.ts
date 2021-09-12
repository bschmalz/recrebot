import { Field, InputType } from 'type-graphql';

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
