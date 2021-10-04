import fetch from 'node-fetch';
import { Campground as CampgroundEntity } from '../entities/Campground';
import { getConnection } from 'typeorm';
import { delay } from '../utils/delay';
import { ScrapedData, ScrapedDataObj } from './types/ScrapedData';
import { getImages } from './getImage';
import { sampleCaliReqBody } from './checkTripRequest';

interface CaliCampResponse {
  PlaceId: number;
}

const url = 'https://calirdr.usedirect.com/RDR/rdr/search/place';

const initialPlaceId = 6;

const getReqBody = (PlaceId: number) => {
  return {
    ...sampleCaliReqBody,
    PlaceId,
  };
};

const caliCamps: ScrapedDataObj = {};
const caliCampsArray: ScrapedData[] = [];
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
  getImages();
  return caliCamps;
};

export const fetchCaliCampground = async (id: number) => {
  let body = getReqBody(id);
  return await fetch(url, {
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
};

const checkCampground = async (id: number) => {
  const res = await fetchCaliCampground(id);
  if (!res || res.error || !res.SelectedPlace) return;
  const { Latitude, Longitude, PlaceId, Name } = res.SelectedPlace;

  const cg = {
    latitude: Latitude as number,
    longitude: Longitude as number,
    name: Name as string,
    legacy_id: PlaceId as string,
    type: 'campground',
    sub_type: 'res_ca',
    parent_name: 'California State Park',
  };

  caliCamps[id] = cg;
  caliCampsArray.push(cg);

  res.NearbyPlaces?.forEach((place: CaliCampResponse) => {
    if (!campsToCheckObj[place.PlaceId] && place.PlaceId !== initialPlaceId) {
      campsToCheckObj[place.PlaceId] = true;
      campsToCheckAr.push(place.PlaceId);
    }
  });

  return res;
};
