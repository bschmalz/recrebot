import { isValidCoord } from '../utils/isValidCoord';

const puppeteer = require('puppeteer');

export const getCoords = async (searchString: string) => {
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
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 2000, height: 1400 });

    await page.goto('https://www.google.com/maps/?q=' + searchString);

    await page.waitForNavigation();
    await page.waitForTimeout(5000);

    const links = await page.evaluate(() => {
      const l: HTMLAnchorElement[] = Array.from(document.querySelectorAll('a'));
      return l.map((link) => link.href);
    });

    if (
      links[1] &&
      links[1].indexOf('https://www.google.com/maps/place') === 0
    ) {
      await page.goto(links[1]);
      await page.waitForNavigation();
      await page.waitForTimeout(6000);
    }

    const url = await page.url();

    const startIndex = url.indexOf('@') + 1;
    const endIndex = url.indexOf('data=');
    const str = url.slice(startIndex, endIndex);
    const [lat, lng] = str.split(',');

    await browser.close();
    return [lat, lng];
  } catch (e) {
    if (browser && browser.close) {
      await browser.close();
    }
    return [0, 0];
  }
};

export const getCoordsBatched = async (
  badBatch: { id: string; searchStr: string }[]
) => {
  const resultData: { [key: string]: { lat: number; lng: number } } = {};
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 2000, height: 1400 });
  // let id, searchStr, lat, lng, url, startIndex, endI;
  for (let i = 0; i < badBatch.length; i++) {
    try {
      const { id, searchStr } = badBatch[i];

      await page.goto('https://www.google.com/maps/?q=' + searchStr);
      await page.waitForNavigation();
      await page.waitForTimeout(3000);

      const links = await page.evaluate(() => {
        const l: HTMLAnchorElement[] = Array.from(
          document.querySelectorAll('a')
        );
        return l.map((link) => link.href);
      });

      if (
        links[1] &&
        links[1].indexOf('https://www.google.com/maps/place') === 0
      ) {
        await page.goto(links[1]);
        await page.waitForNavigation();
        await page.waitForTimeout(6000);
      }

      const url = await page.url();

      const startIndex = url.indexOf('@') + 1;
      const endIndex = url.indexOf('data=');
      const str = url.slice(startIndex, endIndex);
      const [lat, lng] = str.split(',');

      if (isValidCoord(lat, lng)) {
        resultData[id] = { lat, lng };
      }
    } catch (e) {
      console.log('error', e);
    }
  }

  await browser.close();
  return resultData;
};
