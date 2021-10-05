import { memoFetch } from './memoFetch';

const locMemo = memoFetch();

const returnText = true;

export const getLocationDescription = async ({
  type,
  sub_type,
  subparent_id,
  legacy_id,
}) => {
  if (type === 'campground') {
    if (sub_type === 'res_ca') {
      const res = await locMemo(
        `${process.env.NEXT_PUBLIC_API_URL}/rc-description/${legacy_id}`,
        returnText
      ).then((res) => res.text());
      return res;
    } else {
      const res = await locMemo(
        `https://www.recreation.gov/api/camps/campgrounds/${legacy_id}`
      );
      let str = '';
      const dmap = res?.campground?.facility_description_map;
      if (!dmap || !Object.keys(dmap).length) return str;
      for (let key in dmap) {
        str += dmap[key];
      }
      return str;
    }
  } else {
    const res = await locMemo(
      `https://www.recreation.gov/api/permitcontent/${subparent_id}`
    );
    return res.payload.divisions[legacy_id].description;
  }
};
