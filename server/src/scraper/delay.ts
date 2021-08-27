function randomInteger(min = 2345, max = 4567) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export const delay = () => {
  return new Promise((res) => setTimeout(res, randomInteger()));
};
