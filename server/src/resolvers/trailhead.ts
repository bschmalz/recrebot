import { Trailhead } from '../entities/Trailhead';
import { ObjectType, Field, Query, Resolver, Arg } from 'type-graphql';
import { SearchInput } from './types';
import { LocationSearch } from '../utils/LocationSearch';

@ObjectType()
class TrailheadsResponse {
  @Field(() => [Trailhead])
  trailheads: Trailhead[];
}

@ObjectType()
class TrailheadResponse {
  @Field(() => Trailhead)
  trailhead: Trailhead | undefined;
}

@Resolver(Trailhead)
export class TrailheadResolver {
  @Query(() => TrailheadsResponse)
  async searchTrailheads(
    @Arg('input') input: SearchInput
  ): Promise<TrailheadsResponse> {
    const ThSearch = new LocationSearch<Trailhead>(input, 'trailhead');
    const trailheads = await ThSearch.search();
    return {
      trailheads,
    };
  }

  @Query(() => TrailheadResponse)
  async getTrailhead(@Arg('id') id: Number): Promise<TrailheadResponse> {
    const trailhead: Trailhead | undefined = await Trailhead.findOne({
      where: { id },
    });
    return { trailhead: trailhead };
  }
}
