const config = require('./.eslintrc.js');

config.rules['prettier/prettier'] = ['error', { singleQuote: true }];

module.exports = config;
