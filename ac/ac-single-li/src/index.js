// @flow

import { isEmpty, isObject } from 'lodash';
import {
  type ActivityPackageT,
  uuid,
  ProgressDashboard,
  values
} from 'frog-utils';
import upgradeFunctions from './upgradeFunctions';

const learningItems = [
  {
    id: '1',
    liType: 'li-idea',
    payload: { title: 'Hi', content: 'Hello' },
    createdAt: '2018-05-10T12:02:07.525Z'
  },
  {
    id: '2',
    liType: 'li-image',
    payload: {
      thumburl: 'https://i.imgur.com/ypw3CGOb.jpg',
      url: 'https://i.imgur.com/ypw3CGO.jpg'
    },
    createdAt: '2018-05-10T12:05:08.700Z'
  }
];

const meta = {
  name: 'Add/edit single LI',
  shortDesc: 'New activity, no description available',
  description: 'New activity, no description available',
  exampleData: [
    {
      title: 'Rich Text with Learning Items',
      config: { liTypeEditor: 'li-richText', noSubmit: true, invalid: false },
      data: undefined,
      learningItems
    }
  ]
};

const config = {
  type: 'object',
  properties: {
    title: { type: 'string', title: 'Title' },
    instructions: { type: 'string', title: 'Instructions' },
    liType: {
      title: 'Learning Item Type',
      type: 'learningItemType'
    },
    liTypeEditor: {
      title: 'Learning Item Type (Editable)',
      type: 'learningItemTypeEditor',
      default: 'li-textArea'
    },
    noSubmit: {
      title: 'No submit button, directly edit',
      type: 'boolean',
      default: true
    },
    allowEditing: {
      title: 'Allow editing after submission',
      default: true,
      type: 'boolean'
    }
  }
};

const formatProduct = (_, product) => {
  const id = uuid();
  return product.li ? { [id]: { id, li: product.li } } : {};
};

const configUI = {
  instructions: { 'ui:widget': 'textarea' },
  allowEditing: { conditional: formData => !formData.noSubmit },
  liTypeEditor: { conditional: 'noSubmit' },
  liType: { conditional: formData => !formData.noSubmit }
};

const validateConfig = [
  formData =>
    formData.noSubmit && isEmpty(formData.liTypeEditor)
      ? {
          err:
            'You need to choose a specific Learning Item type to allow for direct editing'
        }
      : null
];

const mergeFunction = (obj: Object, dataFn: Object) => {
  let empty = true;
  if (!isEmpty(obj.data) && isObject(obj.data)) {
    const li = values(obj.data)?.[0]?.li;
    if (li) {
      dataFn.objInsert({ li });
      empty = false;
    }
  }
  if (empty && obj.config.noSubmit && obj.config.liTypeEditor) {
    const newLI = dataFn.createLearningItem(obj.config.liTypeEditor);
    if (newLI) {
      dataFn.objInsert({ li: newLI });
    }
  }
};

const dataStructure = {};

export default ({
  id: 'ac-single-li',
  type: 'react-component',
  configVersion: 2,
  meta,
  config,
  configUI,
  validateConfig,
  formatProduct,
  dashboards: { progress: ProgressDashboard },
  dataStructure,
  mergeFunction,
  upgradeFunctions
}: ActivityPackageT);
