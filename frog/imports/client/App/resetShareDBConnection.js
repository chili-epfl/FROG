import * as Sentry from '@sentry/browser';

import { connection } from './connection';

export const resetShareDBConnection = () => {
  connection.createFetchQuery('rz', { resetUserId: Meteor.userId() });
  Sentry.configureScope(scope => {
    scope.setUser({
      email: Meteor.user()?.emails?.[0]?.address || Meteor.userId()
    });
  });
};
