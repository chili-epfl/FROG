// @flow

const hashCode = (str = '') => {
  let hash = 0;
  let i = 0;
  for (; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash); // eslint-disable-line no-bitwise
  }
  return hash;
};

// we use the multiple modulos to ensure that the hue is always within 0-360, since
// some functions (tinycolor2 in quill-cursors) does not accept negative hue values
const pickColor = (str: string) => {
  return `hsl(${((hashCode(str) % 360) + 360) % 360}, 100%, 30%)`;
};

export { pickColor };
