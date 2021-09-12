export const shouldOrderByCenter = ({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) => {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  else return true;
};
