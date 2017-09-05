/* eslint-disable */

console.log('jest.config')
module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^meteor/(.*)$': '<rootDir>/fakeMeteor'
  },
  moduleDirectories: [
    'node_modules'
  ]

};
