/* eslint-disable */

module.exports = {
  rootDir: __dirname,
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^meteor/(.*)$': '<rootDir>/frog/lib/fakeMeteor'
  },
  moduleDirectories: [
    'node_modules'
  ]
};
