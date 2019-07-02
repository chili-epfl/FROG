// @flow
import redis from 'redis';
import { Meteor } from 'meteor/meteor';
import { operatorTypes, operatorTypesObj } from '../imports/operatorTypes';
import { ExternalOperators } from '/imports/collections';

export default () => {
  ExternalOperators.find({})
    .fetch()
    .forEach(ext => {
      operatorTypes.push(ext);
      operatorTypesObj[ext.id] = ext;
    });
  const sub = redis.createClient(
    Meteor.settings.externalOperatorRedis || 'redis://127.0.0.1:6379',
    {
      retry_strategy: () => undefined
    }
  );
  const pub = redis.createClient(
    Meteor.settings.externalOperatorRedis || 'redis://127.0.0.1:6379',
    {
      retry_strategy: () => undefined
    }
  );
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
          console.info('Registered new operator', msg);
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
