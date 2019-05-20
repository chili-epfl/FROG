// @flow

import { isEmpty, isObject } from 'lodash';
import {
  type ActivityPackageT,
  uuid,
  ProgressDashboard,
  values
} from 'frog-utils';
import upgradeFunctions from './upgradeFunctions';

const meta = {
  name: 'Add/edit single Learning Item',
  shortDesc: 'New activity, no description available',
  description: 'New activity, no description available',
  category: 'Single Learning Items',
  supportsLearningItems: true
};

const config = {
  type: 'object',
  properties: {
    title: { type: 'string', title: 'Title' },
    instructions: { type: 'rte', title: 'Instructions' },
    allowEditing: {
      title: 'Allow editing after submission',
      default: true,
      type: 'boolean'
    },
    duplicateLI: {
      title: 'Create duplicate of incoming Learning Item',
      type: 'boolean'
    },
    openIncomingInEdit: {
      title: 'Open incoming Learning Item in edit-mode',
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
  allowEditing: {
    conditional: formData => formData.submit || !formData.liTypeEditor
  }
};

const mergeFunction = async (obj: Object, dataFn: Object, data: Object) => {
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
  if (empty && obj.config.liTypeEditor && !data.li) {
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
