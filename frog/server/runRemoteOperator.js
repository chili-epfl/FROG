// @flow

import redis from 'redis';
import { Meteor } from 'meteor/meteor';
import { uuid } from 'frog-utils';

export default (operatorType: string) => (data: any, object: any) => {
  console.log('remote operator');
  return new Promise(resolve => {
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

    console.log('listening');
    client.blpop(
      'frog.external.' + returnId,
      0,
      Meteor.bindEnvironment((err, msg) => {
        console.log(msg);
        try {
          const incoming = JSON.parse(msg[1]);
          console.log(incoming);
          if (incoming.msgType === 'product') {
            resolve(incoming.payload);
          }
        } catch (e) {}
      })
    );
  });
};
