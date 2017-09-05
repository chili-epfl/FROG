/* eslint-disable */

module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^meteor/(.*):(.*)$':
      '<rootDir>/fakeMeteor',
    '^meteor/(.*)$':
      '<rootDir>/fakeMeteor'
  },
  moduleDirectories: [
    'node_modules'
  ]

};
