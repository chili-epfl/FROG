import pkg from './index';
import {
  uuid,
  wrapUnitAll,
  type productOperatorT,
  type activityDataT,
  isBrowser
} from 'frog-utils';
import Twitter from 'twitter';

const operator = (configData: Object) => {
  const client = new Twitter({
    consumer_key: configData.consumerKey,
    consumer_secret: configData.consumerSecret,
    access_token: configData.accessTokenKey,
    access_token_secret: configData.accessTokenSecret
  });
  client
    .get('search/tweets', { q: configData.query })
    .then(function(tweet) {
      console.log(tweet);
    })
    .catch(function(error) {
      throw error;
    });
};

export default { ...pkg, operator };
