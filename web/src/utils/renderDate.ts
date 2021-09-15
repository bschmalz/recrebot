import { isDate } from './isDate';

export const renderDate = (date) => {
  let dateToCheck;
  if (isDate(date)) {
    dateToCheck = date;
  } else {
    dateToCheck = new Date(date);
    if (!isDate(dateToCheck)) return '';
  }
  return `${dateToCheck.getMonth() + 1}/${dateToCheck.getDate()}`;
};
