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
  outputDefinition: {
    LI_title: { title: 'Title field', type: 'string' },
    LI_content: { title: 'Content filed', type: 'string' },
    LI_source: { title: 'Source document', type: 'string' }
  },
  meta,
  LearningItems: [liType]
}: productOperatorT);
