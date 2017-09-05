/* eslint-disable */

module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^meteor/(.*)$': '<rootDir>/frog/lib/fakeMeteor'
  },
  moduleDirectories: [
    'node_modules'
  ]
};
