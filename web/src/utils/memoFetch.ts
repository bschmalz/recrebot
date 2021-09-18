import { delay } from './delay';

export const memoFetch = () => {
  const cache = {};
  return async (url) => {
    if (cache[url]) {
      return new Promise((resolve) => resolve(cache[url]));
    } else {
      let res = await fetch(url).then((r) => r.json());
      while (res.error) {
        delay();
        res = await fetch(url).then((r) => r.json());
      }
      cache[url] = res;
      return res;
    }
  };
};
