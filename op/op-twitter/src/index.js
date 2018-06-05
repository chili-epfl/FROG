// @flow
import queryString from 'query-string';
import { compact } from 'lodash';
import Twitter from 'twitter';
import fetch from 'isomorphic-fetch';
import {
  uuid,
  wrapUnitAll,
  type productOperatorT,
  type activityDataT
} from 'frog-utils';
import liType from './liType';

export const meta = {
  name: 'Get Tweets',
  shortName: 'Twitter',
  shortDesc: 'Get Tweets based on a search query',
  description: ''
};

export const config = {
  type: 'object',
  properties: {
    consumerKey: {
      type: 'string',
      title: 'Consumer key'
    },
    consumerSecret: {
      type: 'string',
      title: 'Consumer secret'
    },
    accessTokenKey: {
      type: 'string',
      title: 'Access token key'
    },
    accessTokenSecret: {
      type: 'string',
      title: 'Access token secret'
    },
    query: {
      type: 'string',
      title: 'Query'
    }
  }
};

export const operator = (configData: Object) => {
  const client = new Twitter({
    consumer_key: configData.consumerKey,
    consumer_secret: configData.consumerSecret,
    access_token_key: configData.accessTokenKey,
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

export default ({
  id: 'op-hypothesis',
  type: 'product',
  operator,
  config,
  meta,
  LearningItems: [liType]
}: productOperatorT);
