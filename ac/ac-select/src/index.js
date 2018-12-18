// @flow

import { type ActivityPackageT, uuid, values } from 'frog-utils';

import dashboards from './dashboards';
import liType from './liType';
import meta from './meta';

const ColorOptions = [
  ['#FFFFFF', 'White'],
  ['#FFFF00', 'Yellow'],
  ['#FF0000', 'Red'],
  ['#0000FF', 'Blue'],
  ['#32CD32', 'Green']
];

const translateColor = hex => ColorOptions.find(x => x[0] === hex)?.[1];

const formatProduct = (_, product, instanceId, user) => {
  if (product.highlighted) {
    return Object.keys(product.highlighted).reduce((acc, x) => {
      const id = uuid();
      return {
        ...acc,
        [id]: {
          id,
          category: translateColor(product.highlighted[x].color),
          user,
          li: {
            liDocument: {
              liType: 'li-wordSelect',
              createdAt: new Date(),
              createdByUser: instanceId,
              createdBy: 'ac-select',
              payload: { word: x, color: product.highlighted[x].color }
            }
          }
        }
      };
    }, {});
  } else {
    return {};
  }
};

const config = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Title'
    },
    text: {
      type: 'string',
      title: 'Text'
    },
    wordPhrases: {
      title:
        'Multi-words expression to treat as a single unit, separated by comma',
      type: 'string'
    },
    multi: {
      type: 'boolean',
      title: 'Color each highlighted word differently'
    },
    chooseColor: {
      type: 'boolean',
      title: 'Let students choose which color to use for highlighting'
    }
  }
};

const mergeFunction = (object, dataFn) =>
  values(object.data || {})
    .filter(x => x?.li?.liDocument?.liType === 'li-wordSelect')
    .forEach(x => {
      const li = x.li.liDocument.payload;
      dataFn.objInsert(
        {
          color: li.color
        },
        ['highlighted', li.word]
      );
    });

const configUI = {
  text: {
    'ui:widget': 'textarea',
    'ui:options': {
      rows: 5
    }
  },
  multi: { conditional: formData => !formData.chooseColor },
  chooseColor: { conditional: formData => !formData.multi }
};

const dataStructure = { highlighted: {}, currentColor: '#FFFF00' };

export default ({
  id: 'ac-select',
  type: 'react-component',
  configVersion: 1,
  dataStructure,
  meta,
  config,
  configUI,
  mergeFunction,
  formatProduct,
  dashboards,
  LearningItems: [liType]
}: ActivityPackageT);
