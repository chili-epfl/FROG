/* eslint-disable */

module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^meteor/(.*)$': '<rootDir>/frog/lib/fakeMeteor',
    '^/(.*)$': '<rootDir>/frog/$1'
  },
  moduleDirectories: ['node_modules']
};
