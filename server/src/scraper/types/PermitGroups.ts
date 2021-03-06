export interface PermitGroup {
  FacilityID: string;
  FacilityName: string;
  RecAreaName: string;
  Longitude: number;
  Latitude: number;
  ParentRecAreaID: string;
}

export interface PermitGroupResponse {
  payload: {
    has_lottery?: boolean;
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
