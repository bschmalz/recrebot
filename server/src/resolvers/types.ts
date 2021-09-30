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
