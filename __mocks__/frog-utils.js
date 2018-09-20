const frogUtils = jest.genMockFromModule('frog-utils');

frogUtils.uuid = (() => {
  let counter = 0;
  return () => {
    counter += 1;
    return counter;
  };
})();

module.exports = frogUtils;
