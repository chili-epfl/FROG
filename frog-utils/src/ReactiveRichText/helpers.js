const hashCode = function(str = '') {
  let hash = 0;
  let i = 0;
  for (; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash); // eslint-disable-line no-bitwise
  }
  return hash;
}

const pickColor = function(str) {
  return `hsl(${hashCode(str) % 360}, 100%, 30%)`;
}

export { pickColor };
