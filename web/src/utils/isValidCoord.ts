export const isValidCoord = (lat: number, lng: number) => {
  return lat > 19.5 && lat < 64.85 && lng > -161.755 && lng < -68.011;
};
