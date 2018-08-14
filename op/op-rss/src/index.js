import liType from './liType';

export const meta = {
  name: 'RSS',
  shortName: 'RSS',
  shortDesc: '',
  description: '',
  preview: true
};

export const config = {
  type: 'object',
  properties: {
    urls: {
      type: 'array',
      title: 'URLs',
      items: { type: 'string' },
      default: ['']
    },
    limit: {
      default: 20,
      type: 'number',
      title: 'Max number of items to fetch'
    }
  }
};

export default ({
  id: 'op-rss',
  type: 'product',
  config,
  configVersion: 1,
  meta,
  LearningItems: [liType]
}: productOperatorT);
