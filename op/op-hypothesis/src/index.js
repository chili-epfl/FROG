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
    group: { type: 'string', title: 'Group' },
    url: {
      type: 'string',
      title: 'URL'
    },
    search: { type: 'string', title: 'Search term' },
    limit: {
      default: 20,
      type: 'number',
      title: 'Max number of items to fetch (must be less than 1000)'
    },
    afterDate: {
      type: 'string',
      title: 'On or after date (must be fully specified)'
    },
    token: { title: 'Authorization token', type: 'string' }
  }
};

const configUI = { afterDate: { 'ui:widget': 'alt-date' } };

const validateConfig = [
  formData =>
    formData.tag || formData.url || formData.search || formData.group
      ? null
      : { err: 'You need either tag, URL, group, or search term' },
  formData =>
    formData.limit > 1000
      ? {
          err:
            'The limit cannot be above 1000, because of Hypothes.is API limits'
        }
      : null
];

export default ({
  id: 'op-hypothesis',
  type: 'product',
  configVersion: 1,
  config,
  configUI,
  validateConfig,
  meta,
  LearningItems: [liType]
}: productOperatorT);
