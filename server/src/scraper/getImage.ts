import { Campground } from '../entities/Campground';
import { getRepository } from 'typeorm';
import { Trailhead } from '../entities/Trailhead';

const puppeteer = require('puppeteer');
const fs = require('fs');

export const getImage = async (
  searchString: string,
  type: string,
  id: number
) => {
  const browser = await puppeteer.launch();
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
    `../web/public/${type}/${id}.png`,
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
  //   const campgrounds = await getRepository(Campground)
  //     .createQueryBuilder('campground')
  //     .getMany();

  //   for (let i = 0; i < campgrounds.length; i++) {
  //     const cg = campgrounds[i];
  //     const str = `${cg.name} campground${
  //       cg.recarea_name ? ` ${cg.recarea_name}` : ''
  //     }`;
  //     await getImage(str, 'campground', cg.id);
  //   }

  const trailheads = await getRepository(Trailhead)
    .createQueryBuilder('trailhead')
    .getMany();

  for (let i = 0; i < trailheads.length; i++) {
    const th = trailheads[i];
    const str = `${th.name} trail${
      th.recarea_name ? ` ${th.recarea_name}` : ''
    }${th.district ? ` ${th.district}` : ''}`;
    await getImage(str, 'trailhead', th.id);
  }
};
