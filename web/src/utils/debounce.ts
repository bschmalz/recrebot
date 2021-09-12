export const debounce = (func: Function, wait: number) => {
  let timeout;
  return function (...args) {
    const context = this;
    const later = () => {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (!timeout) {
      func.apply(context, args);
    }
  };
};
