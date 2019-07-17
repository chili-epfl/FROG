// @flow
import { type productOperatorT } from '/imports/frog-utils';
import litype from './liType';

export const meta = {
  name: 'Get Tweets',
  shortName: 'Twitter',
  shortDesc: 'Get Tweets based on a search query',
  description: '',
  preview: true,
  category: 'From API'
};

export const config = {
  type: 'object',
  required: ['query'],
  properties: {
    query: {
      type: 'string',
      title: 'Query'
    },
    count: { type: 'number', title: 'Number of tweets to get', default: 15 }
  }
};

export default ({
  id: 'op-twitter',
  type: 'product',
  config,
  configVersion: 1,
  meta,
  LearningItems: [litype]
}: productOperatorT);
