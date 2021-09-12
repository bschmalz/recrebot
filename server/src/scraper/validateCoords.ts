import { getCoords } from './getCoords';
import { isValidCoord } from './isValidCoord';

interface coordArrayItem {
  latitude: number;
  longitude: number;
  recarea_name: string;
  legacy_id: string;
  name: string;
}

export const validateCoords = async (
  itemArray: coordArrayItem[],
  searchType: string
) => {
  const then: Date = new Date();

  // Make sure our items have valid coords
  const itemsWithBadCoords: { id: string; searchStr: string }[] = [];

  itemArray.forEach((item) => {
    if (!isValidCoord(item.latitude, item.longitude) && item.recarea_name) {
      itemsWithBadCoords.push({
        id: item.legacy_id,
        searchStr: `${item.name} ${searchType}${
          item.recarea_name ? ` ${item.recarea_name}` : ''
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
      console.log('error validating ' + searchStr);
    }
  }

  const itemsWithValidCoords: coordArrayItem[] = [];
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
