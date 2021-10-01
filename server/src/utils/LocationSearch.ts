import { SearchInput } from 'src/resolvers/types';
import { getManager } from 'typeorm';
import { getLatLng } from './getLatLng';
import { shouldOrderByCenter } from './shouldOrderByCenter';

interface handleSearchInterface {
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

export class LocationSearch<T> {
  constructor(private input: SearchInput, private databaseName: string) {}
  maxResults = 400;

  search = async () => {
    const searchStr = this.getSearchStr();
    if (!searchStr) {
      return [];
    } else {
      return (await getManager().query(searchStr)) as T[];
    }
  };

  getSearchStr(): string | null {
    const { searchTerm, mapBounds, mapCenter, filterOnBounds } = this.input;

    if (!searchTerm?.length || searchTerm.length < 3) {
      // Do special checks for location only searches
      // We need valid map data and our map bounds to not be too close
      return this.handleLocationOnlySearch({
        searchTerm,
        mapBounds,
        mapCenter,
        filterOnBounds,
      });
    }
    if (!mapBounds) return this.handleTextOnlySearch(searchTerm);
    const { boundsAreValid, minLat, maxLat, minLng, maxLng } =
      getLatLng(mapBounds);
    if (!boundsAreValid) return this.handleTextOnlySearch(searchTerm);
    const { lat, lng }: { lat: number; lng: number } = JSON.parse(mapCenter);
    const orderByCenter = shouldOrderByCenter({ lat, lng });

    return this.handleSearch({
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

  handleSearch = ({
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
    try {
      const searchStr = `
      select *
      from ${this.databaseName} a
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
      limit ${this.maxResults}`;
      return searchStr;
    } catch (e) {
      return '';
    }
  };

  handleTextOnlySearch = (searchTerm: string) => {
    return `
    select *
    from ${this.databaseName} a
    where (a.parent_name ilike '%${searchTerm}%' or a.name ilike '%${searchTerm}%')
    limit ${this.maxResults}`;
  };

  handleLocationOnlySearch = ({
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
    if (!filterOnBounds || !mapBounds) return null;
    const { boundsAreValid, minLat, maxLat, minLng, maxLng } =
      getLatLng(mapBounds);
    if (!boundsAreValid) return null;
    if (maxLat - minLat > 3 || maxLng - minLng > 3) return null;
    const { lat, lng }: { lat: number; lng: number } = JSON.parse(mapCenter);
    const orderByCenter = shouldOrderByCenter({ lat, lng });
    return this.handleSearch({
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
}
