// @flow

const hashCode = (str = '') => {
  let hash = 0;
  let i = 0;
  for (; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash); // eslint-disable-line no-bitwise
  }
  return hash;
};

const pickColor = (str: string) => {
  return `hsl(${hashCode(str) % 360}, 100%, 30%)`;
};

export { pickColor };
