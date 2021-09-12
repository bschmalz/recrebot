import { Trailhead } from '../entities/Trailhead';
import { ObjectType, Field, Query, Resolver, Arg } from 'type-graphql';
import { getManager } from 'typeorm';
import { getLatLng } from '../utils/getLatLng';
import { shouldOrderByCenter } from '../utils/shouldOrderByCenter';
import { handleSearchInterface, SearchInput } from './types';

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
    const { searchTerm, mapBounds, mapCenter, filterOnBounds } = input;

    if (!searchTerm?.length || searchTerm.length < 3) {
      // Do special checks for location only searches
      // We need valid map data and our map bounds to not be too close
      return handleLocationOnlySearch({
        searchTerm,
        mapBounds,
        mapCenter,
        filterOnBounds,
      });
    }
    const { boundsAreValid, minLat, maxLat, minLng, maxLng } =
      getLatLng(mapBounds);
    const { lat, lng }: { lat: number; lng: number } = JSON.parse(mapCenter);
    const orderByCenter = shouldOrderByCenter({ lat, lng });

    return handleSearch({
      searchTerm,
      minLat,
      maxLat,
      minLng,
      maxLng,
      lat,
      lng,
      locationSearch: filterOnBounds && boundsAreValid,
      textSearch: true,
      orderByCenter,
    });
  }

  @Query(() => TrailheadResponse)
  async getTrailhead(@Arg('id') id: Number): Promise<TrailheadResponse> {
    const trailhead: Trailhead | undefined = await Trailhead.findOne({
      where: { id },
    });
    return { trailhead: trailhead };
  }
}

const handleSearch = async ({
  searchTerm,
  maxLng,
  minLng,
  maxLat,
  minLat,
  lng,
  lat,
  locationSearch = true,
  orderByCenter = true,
  textSearch = true,
}: handleSearchInterface) => {
  const searchStr = `
  select *
  from trailhead a
  ${
    textSearch && searchTerm?.length
      ? `where (a.name ilike '%${searchTerm}%' or a.recarea_name ilike '%${searchTerm}%' or a.district ilike '%${searchTerm}%' )`
      : ''
  }
  ${locationSearch && textSearch ? 'and' : ''}${
    locationSearch && !textSearch ? 'where' : ''
  }
  ${locationSearch ? `a.longitude < ${maxLng}` : ''}
  ${locationSearch ? `and a.longitude > ${minLng}` : ''}
  ${locationSearch ? `and a.latitude < ${maxLat}` : ''}
  ${locationSearch ? `and a.latitude > ${minLat}` : ''}
  ${
    lng && lat
      ? `order by point(a.longitude,a.latitude) <-> point(${lng}, ${lat})`
      : ''
  }
  limit 400`;

  const trailheads = (await getManager().query(searchStr)) as Trailhead[];

  return {
    trailheads,
  };
};

const handleLocationOnlySearch = ({
  filterOnBounds,
  mapBounds,
  mapCenter,
  searchTerm,
}: {
  filterOnBounds: boolean;
  mapBounds: string;
  mapCenter: string;
  searchTerm: string;
}) => {
  // If we have no query, and aren't filtering on bounds, just give then an
  if (!filterOnBounds || !mapBounds) return { trailheads: [] };
  const { boundsAreValid, minLat, maxLat, minLng, maxLng } =
    getLatLng(mapBounds);
  if (!boundsAreValid) return { trailheads: [] };
  if (maxLat - minLat > 3 || maxLng - minLng > 3) return { trailheads: [] };
  const { lat, lng }: { lat: number; lng: number } = JSON.parse(mapCenter);
  const orderByCenter = shouldOrderByCenter({ lat, lng });
  return handleSearch({
    searchTerm,
    minLat,
    maxLat,
    minLng,
    maxLng,
    lat,
    lng,
    locationSearch: true,
    textSearch: false,
    orderByCenter,
  });
};
