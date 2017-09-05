/* eslint-disable */

module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^meteor/(.*):(.*)$':
      '<rootDir>/fakeMeteor',
    '^meteor/(.*)$':
      '<rootDir>/fakeMeteor',
    '^meteor/(.*)$':
      '<rootDir>/fakeMeteor'
  },
  moduleDirectories: [
    'node_modules',
    '<rootDir>/frog/.meteor/local/build/programs/server/packages',
    '<rootDir>/frog/.meteor/local/build/programs/web.browser/packages/',
    '.meteor/local/build/programs/server/packages',
    '.meteor/local/build/programs/web.browser/packages/'
  ]

};
