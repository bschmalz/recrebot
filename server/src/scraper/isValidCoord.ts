// Simple brute force way to check if a set of coordinates falls within the range of longitute and latitude of the edges of the US
// Catches any 0,0 coords as false as well as random broken ones that don't happen to be in the US
export const isValidCoord = (lat: number, lng: number) => {
  if (!lat || !lng) return false;
  return lat > 19.5 && lat < 64.85 && lng > -161.755 && lng < -68.011;
};
