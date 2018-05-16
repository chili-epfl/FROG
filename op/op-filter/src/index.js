// @flow

import type { productOperatorT } from 'frog-utils';

const meta = {
  name: 'Filter',
  shortDesc: 'Filter list of products.',
  description: 'Filter list of products.'
};

const config = {
  type: 'object',
  properties: {
    condition: {
      title: 'Only include items that fulfill all conditions',
      type: 'inputCondition'
    },
    conditions: {
      title: '',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          logical: {
            title: '',
            type: 'string',
            enum: ['and', 'or'],
            default: 'and'
          },
          condition: {
            type: 'inputCondition',
            title: ''
          }
        }
      }
    }
  }
};

const configUI = {
  conditions: {
    'ui:options': {
      orderable: false
    }
  }
};

const XOR = (a, b) => (a && !b) || (!a && b);

export const objFilter = (
  fConfig: {
    field: string,
    value?: string,
    remove?: boolean,
    removeUndefined?: boolean
  },
  obj: Object
) =>
  (!fConfig.removeUndefined || obj[fConfig.field] !== undefined) &&
  !!XOR(
    fConfig.remove,
    fConfig.value ? obj[fConfig.field] === fConfig.value : obj[fConfig.field]
  );

const operator = (configData, object) => {
  const structure = object.activityData.structure;
  const payload = {};
  const oap = object.activityData.payload;
  Object.keys(oap).forEach(instance => {
    payload[instance] = { data: {} };
    Object.keys(oap[instance].data).forEach(objKey => {
      if (objFilter(configData, oap[instance].data[objKey])) {
        payload[instance].data[objKey] = oap[instance].data[objKey];
      }
    });
  });
  return { structure, payload };
};

export default ({
  id: 'op-filter',
  type: 'product',
  operator,
  config,
  configUI,
  meta
}: productOperatorT);
