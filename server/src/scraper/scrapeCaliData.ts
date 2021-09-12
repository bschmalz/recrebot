import fetch from 'node-fetch';
import { Campground as CampgroundEntity } from '../entities/Campground';
import { getConnection } from 'typeorm';
import { delay } from './delay';
import { CaliCampResponse, ReserveCaliRequest } from './types/CaliCampgroud';
import { Campground, Campgrounds } from './types/Campground';

const url = 'https://calirdr.usedirect.com/RDR/rdr/search/place';

const initialPlaceId = 6;

const sampleBody: ReserveCaliRequest = {
  Nights: 1,
  IsADA: false,
  MinVehicleLength: null,
  UnitCategoryId: 1,
  StartDate: '2022-01-27',
  CustomerId: 0,
  Sort: 'distance',
  WebOnly: true,
  NearbyCountLimit: 10,
  CountUnits: true,
  PlaceId: 6,
  NearbyOnlyAvailable: false,
  UnitTypesGroupIds: [1],
  SleepingUnitId: 83,
  HighlightedPlaceId: 0,
  InSeasonOnly: false,
  NearbyLimit: 100,
  RefreshFavourites: true,
  RestrictADA: false,
  CountNearby: true,
};

const getReqBody = (PlaceId: number) => {
  return {
    ...sampleBody,
    PlaceId,
  };
};

const caliCamps: Campgrounds = {};
const caliCampsArray: Campground[] = [];
const campsToCheckObj: { [key: string]: boolean } = {};
const campsToCheckAr: number[] = [];

export const fetchCaliCamppgrounds = async () => {
  console.log('starting up cali');
  await checkCampground(initialPlaceId);
  let id;
  // Recursively go through the reserve california campgrounds to find them all and fetch their details
  while (campsToCheckAr.length > 0) {
    await delay();
    id = campsToCheckAr.shift() as number;
    await checkCampground(id);
  }
  console.log('There are ' + Object.keys(caliCamps).length + ' cali camps');

  // Add our reserve california campgrounds to the database
  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(CampgroundEntity)
    .values(caliCampsArray)
    .returning('*')
    .execute();
  console.log('added camps to db');
  return caliCamps;
};

const checkCampground = async (id: number) => {
  let body = getReqBody(id);
  const res = await fetch(url, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((r) => r.json())
    .catch((e) => {
      return {
        error: true,
      };
    });
  if (!res || res.error || !res.SelectedPlace) return;
  const { Latitude, Longitude, PlaceId, Name, Description } = res.SelectedPlace;

  const cg = {
    description: Description,
    latitude: Latitude,
    longitude: Longitude,
    name: Name,
    legacy_id: PlaceId,
    source: 'rc',
    recarea_name: 'California State Park',
  };

  caliCamps[id] = cg;
  caliCampsArray.push(cg);

  res.NearbyPlaces?.forEach((place: CaliCampResponse) => {
    if (!campsToCheckObj[place.PlaceId]) {
      campsToCheckObj[place.PlaceId] = true;
      campsToCheckAr.push(place.PlaceId);
    }
  });

  return res;
};
