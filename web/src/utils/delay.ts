function randomInteger(min = 10, max = 50) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export const delay = () => {
  return new Promise((res) => setTimeout(res, randomInteger()));
};
