/* eslint-disable */
require('regenerator-runtime/runtime');

module.exports = {
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    'packages/reactive-tools/test.js'
  ],
  moduleNameMapper: {
    '^meteor/(.*)$': '<rootDir>/frog/lib/fakeMeteor',
    '^/(.*)$': '<rootDir>/frog/$1',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js'
  },
  moduleDirectories: ['node_modules'],
  setupFiles: ['<rootDir>/node_modules/regenerator-runtime/runtime.js']
};
