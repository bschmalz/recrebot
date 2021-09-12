import * as fs from 'fs';
import * as path from 'path';
import { parse } from '@fast-csv/parse';
import { Campground, Campgrounds } from './types/Campground';
import {
  Division,
  PermitGroup,
  PermitGroupResponse,
} from './types/PermitGroups';
import fetch from 'node-fetch';
import { TrailHead as TrailHeadType } from './types/Trailhead';
import { fetchCaliCamppgrounds } from './scrapeCaliData';
import { Campground as CampgroundEntity } from '../entities/Campground';
import { getConnection } from 'typeorm';
import { Trailhead } from '../entities/Trailhead';
import { delay } from './delay';
import { validateCoords } from './validateCoords';

export const scrapeRecData = () => {
  const recAreas: RecAreas = {};
  const campgroundsArray: Campground[] = [];
  const campgrounds: Campgrounds = {};
  const permitGroups: PermitGroup[] = [];
  const trailheads: TrailHeadType[] = [];

  const parsePermitGroups = async () => {
    // console.log('validating rec gov cg coords');
    // const campsWithValidCoords = await validateCoords(
    //   campgroundsArray,
    //   'Campground'
    // );

    // console.log(
    //   'there are ' + campsWithValidCoords.length + 'rec gov camps being added'
    // );

    // await getConnection()
    //   .createQueryBuilder()
    //   .insert()
    //   .into(CampgroundEntity)
    //   .values(campsWithValidCoords)
    //   .returning('*')
    //   .execute();

    console.log('getting trailheads');

    // Get all associated trailheads from permit groups
    while (permitGroups.length > 0) {
      const pg = permitGroups.shift() as PermitGroup;
      await getTrailheads(pg);
      await delay();
    }

    console.log('validating rec gov th coords');

    const trailsWithValidCoords = await validateCoords(trailheads, 'Trailhead');

    console.log('adding ' + trailsWithValidCoords.length + ' trails to db');

    // Add trailheads to the database
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Trailhead)
      .values(trailsWithValidCoords)
      .returning('*')
      .execute();
    console.log('there are ' + trailheads.length + ' trailheads');
    // fetchCaliCamppgrounds();
  };

  const getTrailheads = async (pg: PermitGroup) => {
    const id = pg.FacilityID;
    const url = 'https://www.recreation.gov/api/permitcontent/' + id;
    const response: PermitGroupResponse = await fetch(url).then((r) =>
      r.json()
    );
    const divisions = response?.payload?.divisions;
    if (!divisions) return;
    for (let key in divisions) {
      const item = divisions[key] as Division;
      if (item.type === 'Entry Point') {
        const t = {
          description: item.description,
          facility_id: pg.FacilityID,
          facility_name: pg.FacilityName,
          legacy_id: item.id,
          district: item.district || '',
          latitude: item.latitude,
          longitude: item.longitude,
          name: item.name,
          recarea_name: pg.RecAreaName || '',
          source: 'rg',
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
        if (row.FacilityID && row.Reservable && row.FacilityName) {
          let lat = parseFloat(row.FacilityLatitude);
          let lng = parseFloat(row.FacilityLongitude);
          const recAreaName = recAreas[row.ParentRecAreaID] || '';

          if (row.FacilityTypeDescription === 'Campground') {
            const cg = {
              legacy_id: row.FacilityID,
              description: row.FacilityDescription,
              name: row.FacilityName,
              latitude: lat,
              longitude: lng,
              recarea_name: recAreaName,
              source: 'rg',
            };
            campgrounds[row.FacilityID] = cg;
            campgroundsArray.push(cg);
          }

          if (row.FacilityTypeDescription === 'Permit') {
            permitGroups.push({
              FacilityID: row.FacilityID,
              FacilityName: row.FacilityName,
              Latitude: lat,
              Longitude: lng,
              RecAreaName: recAreaName,
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
