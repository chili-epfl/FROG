module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^meteor/(.*):(.*)':
      '<rootDir>/frog/.meteor/local/build/programs/server/packages/$1_$2',
    '^meteor/(.*)':
      '<rootDir>/frog/.meteor/local/build/programs/server/packages/$1',
  }
};
