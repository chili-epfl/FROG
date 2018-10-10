function mockFunctions() {
  const original = require.requireActual('frog-utils');
  return {
    ...original,
    default: original,
    uuid: (() => {
      let counter = 0;
      return jest.fn(() => {
        counter += 1;
        return 'cjn' + counter;
      });
    })(),
    getSlug: (() => {
      let counter = 0;
      return jest.fn(() => {
        counter += 1;
        return 'SLU' + counter;
      });
    })()
  };
}

module.exports = mockFunctions();
