/* eslint-disable */

console.log('jest.config')
console.log(__dirname)
module.exports = {
  rootDir: __dirname,
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^meteor/(.*)$': '<rootDir>/fakeMeteor'
  },
  moduleDirectories: [
    'node_modules'
  ]
};
