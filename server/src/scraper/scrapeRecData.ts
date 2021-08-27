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
import { delay } from './delay';
import { TrailHead as TrailHeadType } from './types/Trailhead';
import { fetchCaliCamppgrounds } from './scrapeCaliData';
import { Campground as CampgroundEntity } from '../entities/Campground';
import { getConnection } from 'typeorm';
import { Trailhead } from '../entities/Trailhead';

export const scrapeRecData = () => {
  const recAreas: RecAreas = {};
  const campgroundsArray: Campground[] = [];
  const campgrounds: Campgrounds = {};
  const permitGroups: PermitGroup[] = [];
  const trailheads: TrailHeadType[] = [];

  const parsePermitGroups = async () => {
    console.log(
      'there are ' + Object.keys(campgrounds).length + ' campgrounds'
    );

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(CampgroundEntity)
      .values(campgroundsArray)
      .returning('*')
      .execute();

    // while (permitGroups.length > 0) {
    //   const pg = permitGroups.shift() as PermitGroup;
    //   await getTrailheads(pg);
    //   await delay();
    // }

    // await getConnection()
    //   .createQueryBuilder()
    //   .insert()
    //   .into(Trailhead)
    //   .values(trailheads)
    //   .returning('*')
    //   .execute();
    // console.log('there are ' + trailheads.length + ' trailheads');
    fetchCaliCamppgrounds();
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
        console.log('grabbed ', item.name);
        const t = {
          trail_id: item.id,
          district: item.district || '',
          latitude: item.latitude,
          longitude: item.longitude,
          name: item.name,
          facility_id: pg.FacilityID,
          facility_name: pg.FacilityName,
          recarea_name: pg.RecAreaName || '',
          source: 'rg',
        };
        trailheads.push(t);
      }
    }
  };

  const scrapeFacilities = () => {
    fs.createReadStream(path.resolve(__dirname, 'data', 'Facilities.csv'))
      .pipe(parse({ headers: true }))
      .on('error', (error) => console.error(error))
      .on('data', async (row: Facility) => {
        if (row.FacilityID) {
          if (row.FacilityTypeDescription === 'Campground' && row.Reservable) {
            const cg = {
              campground_id: row.FacilityID,
              name: row.FacilityName,
              longitude: parseFloat(row.FacilityLongitude),
              latitude: parseFloat(row.FacilityLatitude),
              recarea_name: recAreas[row.ParentRecAreaID] || '',
              source: 'rg',
            };
            campgrounds[row.FacilityID] = cg;
            campgroundsArray.push(cg);
          }

          if (row.FacilityTypeDescription === 'Permit' && row.Reservable) {
            permitGroups.push({
              FacilityID: row.FacilityID,
              FacilityName: row.FacilityName,
              Latitude: row.FacilityLatitude,
              Longitude: row.FacilityLongitude,
              RecAreaName: recAreas[row.ParentRecAreaID] || '',
            });
          }
        }
      })
      .on('end', parsePermitGroups);
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
      .on('end', scrapeFacilities);
  };

  scrapeRecAreas();
};
