// @flow

import Twitter from 'twit';
import {
  uuid,
  wrapUnitAll,
  flattenOne,
  type productOperatorRunnerT
} from 'frog-utils';

const operator = (configData: Object) => {
  const client = new Twitter({
    consumer_key: 'ZylPVybW4ewtmZaCTyzs1s0wz',
    consumer_secret: 't7G4KlSMjvLx5ErDDuxf4WsowhTsHGbSb4sxUAV6WShGMdlCIc',
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

export default (operator: productOperatorRunnerT);
