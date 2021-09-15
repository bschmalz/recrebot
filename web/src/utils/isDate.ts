export const isDate = (date) => {
  return date instanceof Date && !isNaN(date.valueOf());
};
