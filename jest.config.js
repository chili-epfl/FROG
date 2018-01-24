/* eslint-disable */

module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/frogapi-test'],
  moduleNameMapper: {
    '^meteor/(.*)$': '<rootDir>/frog/lib/fakeMeteor',
    '^/(.*)$': '<rootDir>/frog/$1'
  },
  moduleDirectories: ['node_modules']
};
