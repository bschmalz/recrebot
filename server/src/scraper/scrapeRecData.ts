import * as fs from 'fs';
import * as path from 'path';
import { parse } from '@fast-csv/parse';
import {
  Division,
  PermitGroup,
  PermitGroupResponse,
} from './types/PermitGroups';
import { fetchCaliCamppgrounds } from './scrapeCaliData';
import { getConnection } from 'typeorm';
import { Trailhead } from '../entities/Trailhead';
import { delay } from '../utils/delay';
import { validateCoords } from './validateCoords';
import { ScrapedData, ScrapedDataObj } from './types/ScrapedData';
import { Campground } from '../entities/Campground';
import { tryToGetImage } from './getImage';
import { Facility, RecAreas } from './types/RecAreas';
import axios from 'axios';

const whiteListedTrailHeads: { [key: string]: boolean } = {
  '233260': true, // Whitney
  '233262': true, // Inyo
  '445856': true, // Humboldt-Toiyabe
  '445857': true, // Seki
  '445858': true, // Sierra NF
};

// Whitney
// Facility ID: 233260
// Sub ids: 166, 406
// Url Example: https://www.recreation.gov/api/permits/233260/divisions/406/availability?start_date=2020-12-31T00:00:00.000Z&end_date=2021-12-31T00:00:00.000Z&commercial_acct=false
// Each sub id has its own url

// Inyo
// Facility ID: 233260
// Sub ids: 430, 434….
// Url Example: https://www.recreation.gov/api/permitinyo/233262/availability?start_date=2021-10-01&end_date=2021-10-31&commercial_acct=false
// All sub ids in the response

// Humboldt-Toiyabe
// Facility ID: 445856
// Sub ids: stuff
// Url Example: https://www.recreation.gov/api/permitinyo/445856/availability?start_date=2021-10-01&end_date=2021-10-31&commercial_acct=false
// All sub ids in the response

// SeKi
// Facility ID: 445857
// Sub ids: stuff
// Url Example: https://www.recreation.gov/api/permitinyo/445857/availability?start_date=2021-10-01&end_date=2021-10-31&commercial_acct=false
// All sub ids in the response

// Sierra National Forest
// Facility ID: 445858
// Sub ids: stuff
// Url Example: https://www.recreation.gov/api/permitinyo/445858/availability?start_date=2021-10-01&end_date=2021-10-31&commercial_acct=false
// All sub ids in the response

export const scrapeRecData = () => {
  const recAreas: RecAreas = {};
  const campgroundsArray: ScrapedData[] = [];
  const campgrounds: ScrapedDataObj = {};
  const permitGroups: PermitGroup[] = [];
  const trailheads: ScrapedData[] = [];

  const parsePermitGroups = async () => {
    console.log('validating rec gov cg coords');
    const campsWithValidCoords = await validateCoords(
      campgroundsArray,
      'Campground'
    );

    console.log('adding to db');
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Campground)
      .values(campsWithValidCoords)
      .returning('*')
      .execute();

    console.log(campsWithValidCoords.length + 'rec gov camps were added');

    console.log('getting trailheads');

    // Get all associated trailheads from permit groups
    while (permitGroups.length > 0) {
      const pg = permitGroups.shift() as PermitGroup;
      await getTrailheads(pg);
      await delay();
    }

    console.log('trailheads', trailheads);

    console.log('validating rec gov th coords');

    const trailsWithValidCoords = await validateCoords(trailheads, 'Trailhead');

    console.log('adding ' + trailsWithValidCoords.length + ' trails to db');

    // Add trailheads to the database
    const trails = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Trailhead)
      .values(trailsWithValidCoords)
      .returning('*')
      .execute();
    console.log('there are ' + trailheads.length + ' trailheads');
    fetchCaliCamppgrounds();
  };

  const getTrailheads = async (pg: PermitGroup) => {
    const id = pg.FacilityID;
    const url = 'https://www.recreation.gov/api/permitcontent/' + id;
    const response: PermitGroupResponse = await axios
      .get(url)
      .then((r) => r.data);
    const divisions = response?.payload?.divisions;
    if (!divisions) return;
    for (let key in divisions) {
      const item = divisions[key] as Division;
      if (item.type === 'Entry Point') {
        const t = {
          subparent_id: pg.FacilityID,
          subparent_name: pg.FacilityName,
          legacy_id: item.id,
          district: item.district || '',
          latitude: item.latitude,
          longitude: item.longitude,
          name: item.name,
          parent_name: pg.RecAreaName || '',
          parent_id: pg.ParentRecAreaID,
          type: 'trailhead',
          sub_type: 'rec_gov',
        };
        trailheads.push(t);
      }
    }
  };

  const scrapeFacilities = async () => {
    fs.createReadStream(path.resolve(__dirname, 'data', 'Facilities.csv'))
      .pipe(parse({ headers: true }))
      .on('error', (error) => console.error(error))
      .on('data', (row: Facility) => {
        if (
          row.FacilityID &&
          row.Reservable &&
          row.Reservable !== 'false' &&
          row.FacilityName
        ) {
          let lat = parseFloat(row.FacilityLatitude);
          let lng = parseFloat(row.FacilityLongitude);
          const recAreaName = recAreas[row.ParentRecAreaID] || '';

          if (row.FacilityTypeDescription === 'Campground') {
            const cg = {
              legacy_id: row.FacilityID,
              name: row.FacilityName,
              latitude: lat,
              longitude: lng,
              parent_name: recAreaName,
              sub_type: 'rec_gov',
              parent_id: row.ParentRecAreaID,
              type: 'campground',
            };
            campgrounds[row.FacilityID] = cg;
            campgroundsArray.push(cg);
          }

          if (whiteListedTrailHeads[row.FacilityID]) {
            permitGroups.push({
              FacilityID: row.FacilityID,
              FacilityName: row.FacilityName,
              Latitude: lat,
              Longitude: lng,
              RecAreaName: recAreaName,
              ParentRecAreaID: row.ParentRecAreaID,
            });
          }
        }
      })
      .on('end', () => {
        console.log('finished scraping facilities');

        parsePermitGroups();
      });
  };

  const scrapeRecAreas = () => {
    fs.createReadStream(path.resolve(__dirname, 'data', 'RecAreas.csv'))
      .pipe(parse({ headers: true }))
      .on('error', (error) => console.error(error))
      .on('data', (row) => {
        if (row.RecAreaID) {
          recAreas[row.RecAreaID] = row.RecAreaName;
        }
      })
      .on('end', () => {
        console.log('finished getting facilities');
        scrapeFacilities();
      });
  };

  scrapeRecAreas();
};
