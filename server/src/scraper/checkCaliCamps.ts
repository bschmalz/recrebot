import { Reservable } from './types/Reservable';
import { delay } from '../utils/delay';
import { logError } from '../utils/logError';
import { sampleCaliReqBody } from './checkTripRequest';
import dayjs from 'dayjs';
import fetch from 'node-fetch';

const reserveCaliUrl = 'https://calirdr.usedirect.com/rdr/rdr/search/place';

export const checkCaliCamps = async (
  camps: Reservable[],
  days: Date[],
  min_nights: number
) => {
  try {
    const dates = days.map((d) => dayjs(d));
    const result: {
      [key: string]: {
        dates: dayjs.Dayjs[];
        url: string;
        location: Reservable;
      };
    } = {};
    for (let c = 0; c < camps.length; c++) {
      const camp = camps[c];
      for (let d = 0; d < dates.length; d++) {
        const date = dates[d];
        const req = {
          ...sampleCaliReqBody,
          Nights: min_nights,
          PlaceId: camp.legacy_id,
          StartDate: date.format('YYYY-MM-DD'),
        };
        const res = await fetch(reserveCaliUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(req),
        }).then((r) => r.json());
        await delay(123, 456);
        const facilities = res?.SelectedPlace?.Facilities || {};
        for (let key in facilities) {
          const f = facilities[key];
          if (f.Available) {
            if (result[camp.name]) {
              if (!result[camp.name].dates.includes(date))
                result[camp.name].dates.push(date);
            } else {
              result[camp.name] = {
                location: camp,
                dates: [date],
                url: 'https://www.reservecalifornia.com/CaliforniaWebHome/Facilities/SearchViewUnitAvailabity.aspx',
              };
            }
          }
        }
      }
    }
    return result;
  } catch (e) {
    if (logError) {
      logError('error checking cali camps', e);
    }
    return {};
  }
};
