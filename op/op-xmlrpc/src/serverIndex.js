import Twitter from 'twit';
import { uuid, wrapUnitAll, flattenOne } from 'frog-utils';

import pkg from './index';

const operator = (configData: Object) => {
  const client = new Twitter({
    consumer_key: 'tXERcMS08nSLjkq4JS6bg',
    consumer_secret: 'rufkoenUeE5MqrDZMWaAxyo5mtD1Ji9QplBiOGFNnck',
    access_token: '9588752-0X4U37AX6zxIyb1dFBcYT7UEGuhPuoLKDdMppJNkPr',
    access_token_secret: 'tipE9o730RiRYADUwgRSr6dxwYHBHmjHFecxA2XOYVlPS'
  });
  return new Promise(resolve =>
    client
      .get('search/tweets', {
        q: configData.query,
        tweet_mode: 'extended',
        result_type: configData.recent || 'recent',
        count: configData.count
      })
      .then(tweet =>
        (tweet?.data?.statuses || []).map(x => ({
          id: uuid(),
          liDocument: {
            liType: 'li-twitter',
            createdAt: new Date(),
            createdBy: 'op-twitter',
            payload: x
          }
        }))
      )
      .then(res =>
        resolve(
          wrapUnitAll(
            flattenOne(res).reduce((acc, x) => {
              const id = uuid();
              return { ...acc, [id]: { id, li: x } };
            }, {})
          )
        )
      )
  );
};

export default { ...pkg, operator };
