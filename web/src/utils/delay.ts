function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export const delay = (min = 10, max = 50) => {
  return new Promise((res) => setTimeout(res, randomInteger(min, max)));
};
