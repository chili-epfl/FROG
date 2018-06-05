// @flow
import redis from 'redis';
import { Meteor } from 'meteor/meteor';
import { operatorTypes, operatorTypesObj } from '../imports/operatorTypes';
import { ExternalOperators } from '../imports/api/activities';

export default () => {
  ExternalOperators.find({})
    .fetch()
    .forEach(ext => {
      operatorTypes.push(ext);
      operatorTypesObj[ext.id] = ext;
    });
  const sub = redis.createClient({ retry_strategy: () => undefined });
  const pub = redis.createClient({ retry_strategy: () => undefined });
  sub.on('error', e =>
    console.info('No Redis client, external operators not available', e)
  );
  pub.on('error', () => {});
  sub.on(
    'subscribe',
    Meteor.bindEnvironment(() => {
      pub.publish('frog.control', JSON.stringify({ msgType: 'who-is-there' }));
    })
  );
  sub.on(
    'message',
    Meteor.bindEnvironment((_, message) => {
      try {
        const msg = JSON.parse(message);
        if (msg.msgType === 'operatorPackage') {
          operatorTypes.push(msg.payload);
          operatorTypesObj[msg.payload.id] = msg.payload;
          ExternalOperators.update(msg.payload.id, msg.payload, {
            upsert: true
          });
        }
      } catch (e) {
        console.warn('Could not parse Redis message', message, e);
      }
    })
  );
  sub.subscribe('frog.control');
};
