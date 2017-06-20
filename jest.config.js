
/* eslint-disable */

module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^meteor/(.*):(.*)$':
      '<rootDir>/frog/.meteor/local/build/programs/server/packages/$1_$2',
    '^meteor/(.*)$':
      '<rootDir>/frog/.meteor/local/build/programs/server/packages/$1',
    '^meteor/(.*)$':
      '<rootDir>/frog/.meteor/local/build/programs/web.browser/packages/$1'
  },
  moduleDirectories: [
    'node_modules',
    '<rootDir>/frog/.meteor/local/build/programs/server/packages',
    '<rootDir>/frog/.meteor/local/build/programs/web.browser/packages/',
    '.meteor/local/build/programs/server/packages',
    '.meteor/local/build/programs/web.browser/packages/'
  ]

};
