import { Campground } from '../entities/Campground';
import { ObjectType, Field, Query, Resolver, Arg } from 'type-graphql';
import { getManager } from 'typeorm';
import { getLatLng } from '../utils/getLatLng';
import { shouldOrderByCenter } from '../utils/shouldOrderByCenter';
import { handleSearchInterface, SearchInput } from './types';

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
    if (!mapBounds) return handleTextOnlySearch(searchTerm);
    const { boundsAreValid, minLat, maxLat, minLng, maxLng } =
      getLatLng(mapBounds);
    if (!boundsAreValid) return handleTextOnlySearch(searchTerm);
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

  @Query(() => CampgroundResponse)
  async getCampground(@Arg('id') id: Number): Promise<CampgroundResponse> {
    const campground: Campground | undefined = await Campground.findOne({
      where: { id },
    });
    return { campground: campground };
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
  from campground a
  ${
    textSearch && searchTerm?.length
      ? `where (a.parent_name ilike '%${searchTerm}%' or a.name ilike '%${searchTerm}%')`
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
    orderByCenter
      ? `order by point(a.longitude,a.latitude) <-> point(${lng}, ${lat})`
      : ''
  }
  limit 400`;

  const campgrounds = (await getManager().query(searchStr)) as Campground[];

  return {
    campgrounds,
  };
};

const handleTextOnlySearch = async (searchTerm: string) => {
  const searchStr = `
  select *
  from campground a
  where (a.parent_name ilike '%${searchTerm}%' or a.name ilike '%${searchTerm}%')
  limit 400`;

  const campgrounds = (await getManager().query(searchStr)) as Campground[];

  return {
    campgrounds,
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
  if (!filterOnBounds || !mapBounds) return { campgrounds: [] };
  const { boundsAreValid, minLat, maxLat, minLng, maxLng } =
    getLatLng(mapBounds);
  if (!boundsAreValid) return { campgrounds: [] };
  if (maxLat - minLat > 3 || maxLng - minLng > 3) return { campgrounds: [] };
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
