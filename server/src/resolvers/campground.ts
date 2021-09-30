import { Campground } from '../entities/Campground';
import { ObjectType, Field, Query, Resolver, Arg } from 'type-graphql';
import { SearchInput } from './types';
import { LocationSearch } from '../utils/LocationSearch';

@ObjectType()
class CampgroundsResponse {
  @Field(() => [Campground])
  campgrounds: Campground[];
}

@ObjectType()
class CampgroundResponse {
  @Field(() => Campground || undefined)
  campground: Campground | undefined;
}

@Resolver(Campground)
export class CampgroundResolver {
  @Query(() => CampgroundsResponse)
  async searchCampgrounds(
    @Arg('input') input: SearchInput
  ): Promise<CampgroundsResponse> {
    const CgSearch = new LocationSearch<Campground>(input, 'campground');
    const campgrounds = await CgSearch.search();
    return {
      campgrounds,
    };
  }

  @Query(() => CampgroundResponse)
  async getCampground(@Arg('id') id: Number): Promise<CampgroundResponse> {
    const campground: Campground | undefined = await Campground.findOne({
      where: { id },
    });
    return { campground: campground };
  }
}
