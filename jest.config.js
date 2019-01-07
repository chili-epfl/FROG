/* eslint-disable */

module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^meteor/(.*)$': '<rootDir>/frog/lib/fakeMeteor',
    '^/(.*)$': '<rootDir>/frog/$1',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js'
  },
  moduleDirectories: ['node_modules']
};
