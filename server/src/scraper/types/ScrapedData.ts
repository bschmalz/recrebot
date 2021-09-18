export interface ScrapedData {
  legacy_id: string;
  description: string;
  name: string;
  latitude: number;
  longitude: number;
  parent_name: string;
  sub_type: string;
  parent_id?: string;
  type: string;
  subparent_name?: string;
  subparent_id?: string;
}

export interface ScrapedDataObj {
  [key: string]: ScrapedData;
}
