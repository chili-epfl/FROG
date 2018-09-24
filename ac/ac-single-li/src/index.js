// @flow

import { isEmpty, isObject } from 'lodash';
import {
  type ActivityPackageT,
  uuid,
  ProgressDashboard,
  values
} from 'frog-utils';

const meta = {
  name: 'Add/edit single LI',
  shortDesc: 'New activity, no description available',
  description: 'New activity, no description available'
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
    allowEditing: {
      title: 'Allow editing after submission',
      default: true,
      type: 'boolean'
    },
    noSubmit: { title: 'No submit button', type: 'boolean' }
  }
};

const formatProduct = (_, product) => {
  const id = uuid();
  return product.li ? { [id]: { id, li: product.li } } : {};
};

const configUI = {
  instructions: { 'ui:widget': 'textarea' },
  noSubmit: { conditional: formData => !isEmpty(formData.liType) }
};

const mergeFunction = (obj: Object, dataFn: Object) => {
  if (!isEmpty(obj?.data) && isObject(obj?.data)) {
    const li = values(obj.data)?.[0]?.li;
    if (li) {
      dataFn.objInsert({ li });
    }
  }
};

const dataStructure = {};

export default ({
  id: 'ac-single-li',
  type: 'react-component',
  configVersion: 1,
  meta,
  config,
  configUI,
  formatProduct,
  dashboards: { progress: ProgressDashboard },
  dataStructure,
  mergeFunction
}: ActivityPackageT);
