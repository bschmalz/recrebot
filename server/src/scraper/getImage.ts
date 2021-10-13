import { Campground } from '../entities/Campground';
import { getRepository } from 'typeorm';
import { Trailhead } from '../entities/Trailhead';
import { delay } from '../utils/delay';

const puppeteer = require('puppeteer');
const fs = require('fs');

const subTypeToFolderName: { [key: string]: string } = {
  rec_gov: 'rg',
  res_ca: 'rc',
};

export const getImage = async (
  searchString: string,
  type: string,
  id: string,
  subType: string,
  browser: any
) => {
  const page = await browser.newPage();
  await page.goto('https://images.google.com');
  await page.type('input', searchString);
  const form = await page.$('form');
  await form.evaluate((form: HTMLFormElement) => form.submit());

  await page.waitForNavigation();

  const src = await page.evaluate(() => {
    const images: HTMLImageElement[] = Array.from(
      document.querySelectorAll('div[data-cid="GRID_STATE0"] img')
    );
    return images.map((link) => link.src);
  });
  var base64Data = src[0].replace(/^data:image\/\w+;base64,/, '');

  fs.writeFile(
    `../web/public/placeImages/${type}/${subType}/${id}.png`,
    base64Data,
    'base64',
    function (err: Error) {
      console.log(err);
    }
  );
  console.log('finished getting image data for ' + searchString);
};

export const getImages = async () => {
  // Make sure image directories exist

  const campgrounds = await getRepository(Campground)
    .createQueryBuilder('campground')
    .getMany();

  for (let i = 0; i < campgrounds.length; i++) {
    const cg = campgrounds[i];
    const str = `${cg.name} campground${
      cg.parent_name ? ` ${cg.parent_name}` : ''
    }`;
    await tryToGetImage(
      str,
      'campground',
      cg.legacy_id,
      subTypeToFolderName[cg.sub_type]
    );
  }

  const trailheads = await getRepository(Trailhead)
    .createQueryBuilder('trailhead')
    .getMany();

  for (let i = 0; i < trailheads.length; i++) {
    const th = trailheads[i];
    const str = `${th.name} trail${th.parent_name ? ` ${th.parent_name}` : ''}`;
    await tryToGetImage(
      str,
      'trailhead',
      th.legacy_id,
      subTypeToFolderName[th.sub_type]
    );
  }
};

export const tryToGetImage = async (
  searchString: string,
  type: string,
  id: string,
  subType: string
) => {
  let browser;
  let tries = 1;
  while (tries < 4) {
    if (tries > 1) {
      await delay();
    }
    try {
      browser =
        process.env.NODE_ENV === 'production'
          ? await puppeteer.launch({
              headless: true,
              args: [
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-sandbox',
              ],
            })
          : await puppeteer.launch();
      await getImage(searchString, type, id, subType, browser);
    } catch (e) {
      tries++;
    } finally {
      tries = 5;
      await browser.close();
    }
  }
};
