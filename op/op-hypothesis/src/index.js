// @flow
import { type productOperatorT } from 'frog-utils';
import liType from './liType';

export const meta = {
  name: 'Get ideas from Hypothesis',
  shortName: 'Hypothesis',
  shortDesc: 'Get ideas from Hypothesis API',
  description:
    'Collect ideas from an Hypothesis API by hashtag or document id.',
  preview: true
};

export const config = {
  type: 'object',
  properties: {
    tag: {
      type: 'string',
      title: 'Hashtag'
    },
    url: {
      type: 'string',
      title: 'URL'
    },
    search: { type: 'string', title: 'Search term' },
    limit: {
      default: 20,
      type: 'number',
      title: 'Max number of items to fetch'
    }
  }
};
const validateConfig = [
  formData =>
    formData.tag || formData.url || formData.search
      ? null
      : { err: 'You need either tag, URL, or search term' }
];

export default ({
  id: 'op-hypothesis',
  type: 'product',
  version: 1,
  config,
  validateConfig,
  meta,
  LearningItems: [liType]
}: productOperatorT);
