export interface PermitGroup {
  FacilityID: string;
  FacilityName: string;
  RecAreaName: string;
  Longitude: string;
  Latitude: string;
}

export interface PermitGroupResponse {
  payload: {
    divisions: {
      [key: string]: Division;
    };
  };
}

export interface Division {
  id: string;
  district: string;
  latitude: number;
  longitude: number;
  name: string;
  type: string;
}
