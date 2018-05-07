// @flow
import { Meteor } from 'meteor/meteor';

import { serverConnection } from './share-db-manager';
import { values, entries } from 'frog-utils';

const activityDocs = {};
const activityQueries = {};

const reactiveListen = (activities: string[]) => {
  [...activities].forEach(act => {
    console.log('beginning to listen to ', act);
    const query = serverConnection.createSubscribeQuery(
      'rz',
      { _id: { $regex: '^' + act } },
      (_, result) => {
        console.log('received ', result.length);
        activityDocs[act] = result;
      }
    );
    activityQueries[act] = query;
    query.once('load', docs => (activityDocs[act] = docs));
    query.on('changed', docs => (activityDocs[act] = docs));
  });
};

Meteor.methods({ 'reactive.listen': reactiveListen });
setInterval(
  () =>
    console.log(
      values(activityQueries).map(
        act => act.ready && act.results.map(x => [x.id, JSON.stringify(x.data)])
      )
    ),
  5000
);
