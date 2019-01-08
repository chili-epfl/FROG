// @flow

import { type productOperatorT } from 'frog-utils';

const meta = {
  name: 'Dataset from quiz data',
  shortDesc: 'Creates dataset for ac-stat from quiz data',
  description: 'Creates dataset for ac-stat from quiz data'
};

const config = {
  type: 'object',
  properties: {
    datasets: {
      type: 'array',
      title: 'Questions',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'Name of the dataset'
          },
          primary: {
            type: 'number',
            title: 'Index of quiz question for the primary data (starts at 0)'
          },
          primaryType: {
            type: 'string',
            enum: ['categorical', 'numerical'],
            default: 'numerical'
          },
          filterMin: {
            type: 'number',
            title: 'Filter values less than (can be left empty)'
          },
          filterMax: {
            type: 'number',
            title: 'Filter values more than (can be left empty)'
          },
          secondary: {
            type: 'number',
            title:
              'Index of quiz question for the secondary data (can be left empty)'
          },
          secondaryType: {
            type: 'string',
            enum: ['categorical', 'numerical'],
            default: 'categorical'
          }
        }
      }
    }
  }
};

export default ({
  id: 'op-dataset',
  type: 'product',
  configVersion: 1,
  config,
  meta
}: productOperatorT);
