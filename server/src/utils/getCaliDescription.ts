import { fetchCaliCampground } from '../scraper/scrapeCaliData';

export const getCaliLocationDescription = async (id: number) => {
  const camp = await fetchCaliCampground(id);
  return camp?.SelectedPlace?.Description;
};
