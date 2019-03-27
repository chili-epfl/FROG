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
  supportsLearningItems: true
};

const config = {
  type: 'object',
  properties: {
    title: { type: 'string', title: 'Title' },
    instructions: { type: 'rte', title: 'Instructions' },
    noSubmit: {
      title: 'No submit button, directly edit',
      type: 'boolean',
      default: true
    },
    allowEditing: {
      title: 'Allow editing after submission',
      default: true,
      type: 'boolean'
    },
    duplicateLI: {
      title: 'Create duplicate of incoming Learning Item',
      type: 'boolean'
    }
  }
};

const formatProduct = (_, product) => {
  const id = uuid();
  return product.li ? { [id]: { id, ...product } } : {};
};

const configUI = {
  instructions: { 'ui:widget': 'textarea' },
  allowEditing: { conditional: formData => !formData.noSubmit }
};

const mergeFunction = async (obj: Object, dataFn: Object) => {
  let empty = true;
  if (!isEmpty(obj.data) && isObject(obj.data)) {
    const li = values(obj.data)?.[0]?.li;
    if (li) {
      if (obj.config.duplicateLI) {
        const newLI = await dataFn.duplicateLI(li);
        dataFn.objInsert({ ...values(obj.data)[0], li: newLI });
        empty = false;
      } else {
        dataFn.objInsert(values(obj.data)[0]);
        empty = false;
      }
    }
  }
  if (empty && obj.config.liTypeEditor) {
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
  formatProduct,
  dashboards: { progress: ProgressDashboard },
  dataStructure,
  mergeFunction,
  upgradeFunctions
}: ActivityPackageT);
