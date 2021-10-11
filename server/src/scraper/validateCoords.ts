import { getCoords } from './getCoords';
import { isValidCoord } from '../utils/isValidCoord';
import { ScrapedData } from './types/ScrapedData';

export const validateCoords = async (
  itemArray: ScrapedData[],
  searchType: string
) => {
  const then: Date = new Date();

  // Make sure our items have valid coords
  const itemsWithBadCoords: { id: string; searchStr: string }[] = [];

  itemArray.forEach((item) => {
    if (!isValidCoord(item.latitude, item.longitude) && item.parent_name) {
      itemsWithBadCoords.push({
        id: item.legacy_id,
        searchStr: `${item.name} ${searchType}${
          item.parent_name ? ` ${item.parent_name}` : ''
        }`,
      });
    }
  });

  const goodCoords: {
    [id: string]: { latitude: number; longitude: number };
  } = {};

  for (let i = 0; i < itemsWithBadCoords.length; i++) {
    const { id, searchStr } = itemsWithBadCoords[i];
    try {
      const [latitude, longitude] = await getCoords(searchStr);
      if (isValidCoord(latitude, longitude)) {
        goodCoords[id] = { latitude, longitude };
      }
    } catch (e) {
      console.error('error validating ' + searchStr);
    }
  }

  const itemsWithValidCoords: ScrapedData[] = [];
  itemArray.forEach((item) => {
    if (item.name) {
      if (isValidCoord(item.latitude, item.longitude)) {
        itemsWithValidCoords.push(item);
      } else if (goodCoords[item.legacy_id]) {
        itemsWithValidCoords.push({
          ...item,
          latitude: goodCoords[item.legacy_id].latitude,
          longitude: goodCoords[item.legacy_id].longitude,
        });
      }
    }
  });

  return itemsWithValidCoords;
};
