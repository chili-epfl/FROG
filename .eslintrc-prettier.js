const config = require('./.eslintrc.js');

config.rules['prettier/prettier'] = ['warn', { singleQuote: true }];

module.exports = config;
