export const getLatLng = (mb: string) => {
  const { _sw, _ne } = JSON.parse(mb);
  const minLat: number = _sw.lat;
  const maxLat: number = _ne.lat;
  const minLng: number = _sw.lng;
  const maxLng: number = _ne.lng;
  const boundsAreValid =
    typeof minLat !== 'number' ||
    typeof maxLat !== 'number' ||
    typeof minLng !== 'number' ||
    typeof maxLng !== 'number'
      ? false
      : true;

  return { boundsAreValid, minLat, maxLat, minLng, maxLng };
};
