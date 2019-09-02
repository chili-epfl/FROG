const Sentry = require('@sentry/node');

Sentry.init({
  dsn: 'https://59d972c46140436a8bd7094bd6e3eb82@sentry.io/214223',
  release: Meteor.gitCommitHash,
  environment: process.env.NODE_ENV
});

require('./main_actual');
