import { delay } from './delay';
import axios from 'axios';

export interface MemoResponse {
  [key: string]: any;
}

export const memoFetch = () => {
  const cache: MemoResponse = {};
  return async (url: string) => {
    let trys = 0;
    if (cache[url]) {
      return new Promise((resolve) => resolve(cache[url]));
    } else {
      let res = await axios
        .get(url)
        .then((r) => r.data)
        .catch((e) => ({ error: true }));
      while (res.error && trys < 5) {
        trys++;
        delay();
        res = await axios
          .get(url)
          .then((r) => r.data)
          .catch((e) => ({ error: true }));
      }
      cache[url] = res;
      return res;
    }
  };
};
