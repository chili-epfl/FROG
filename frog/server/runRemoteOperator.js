// @flow

import redis from 'redis';
import { Meteor } from 'meteor/meteor';
import { uuid } from 'frog-utils';

export default (operatorType: string) => (data: any, object: any) =>
  new Promise(resolve => {
    const client = redis.createClient();
    client.on('error', e => {
      console.error('Redis error', e);
    });
    const list = 'frog.operator.' + operatorType;
    const returnId = uuid();
    client.rpush(
      list,
      JSON.stringify({ msgType: 'run', data, object, callback: returnId })
    );

    client.blpop(
      'frog.external.' + returnId,
      0,
      Meteor.bindEnvironment((err, msg) => {
        try {
          const incoming = JSON.parse(msg[1]);
          if (incoming.msgType === 'product') {
            resolve(incoming.payload);
          }
        } catch (e) {
          console.error('Broken incoming message', msg[1], e);
        }
      })
    );
  });
