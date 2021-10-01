import { delay } from './delay';
import fetch from 'node-fetch';

export interface MemoResponse {
  [key: string]: any;
}

export const memoFetch = () => {
  const cache: MemoResponse = {};
  return async (url: string) => {
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
