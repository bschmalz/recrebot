import { Campground } from '../entities/Campground';
import { getRepository } from 'typeorm';
import { Trailhead } from '../entities/Trailhead';
import { delay } from '../utils/delay';

const puppeteer = require('puppeteer');
const fs = require('fs');

export const getImage = async (
  searchString: string,
  type: string,
  id: number
) => {
  const browser =
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
    `./public/${type}/${id}.png`,
    base64Data,
    'base64',
    function (err: Error) {
      console.log(err);
    }
  );
  await browser.close();
  console.log('finished getting image data for ' + searchString);
};

export const getImages = async () => {
  const campgrounds = await getRepository(Campground)
    .createQueryBuilder('campground')
    .getMany();

  for (let i = 0; i < campgrounds.length; i++) {
    const cg = campgrounds[i];
    const str = `${cg.name} campground${
      cg.parent_name ? ` ${cg.parent_name}` : ''
    }`;
    await tryToGetImage(str, 'campground', cg.id);
  }

  const trailheads = await getRepository(Trailhead)
    .createQueryBuilder('trailhead')
    .getMany();

  for (let i = 0; i < trailheads.length; i++) {
    const th = trailheads[i];
    const str = `${th.name} trail${th.parent_name ? ` ${th.parent_name}` : ''}`;
    await tryToGetImage(str, 'trailhead', th.id);
  }
};

export const tryToGetImage = async (
  searchString: string,
  type: string,
  id: number
) => {
  let tries = 1;
  while (tries < 3) {
    if (tries > 1) {
      await delay();
    }
    try {
      await getImage(searchString, type, id);
      tries = 5;
    } catch (e) {
      tries++;
    }
  }
};
