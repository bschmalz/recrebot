interface Facility {
  FacilityID: string;
  ParentRecAreaID: string;
  FacilityDescription: string;
  FacilityName: string;
  FacilityTypeDescription: string;
  FacilityLongitude: string;
  FacilityLatitude: string;
  Reservable: string;
}

interface RecAreas {
  [key: string]: string;
}
