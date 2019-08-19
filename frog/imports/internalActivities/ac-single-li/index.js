// @flow

import { isEmpty, isObject } from 'lodash';
import {
  type ActivityPackageT,
  uuid,
  ProgressDashboard,
  values
} from '/imports/frog-utils';
import upgradeFunctions from './upgradeFunctions';

const meta = {
  name: 'Add/edit single Learning Item',
  shortDesc: '',
  description: '',
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

const formatProduct = (_, product, instanceId, username, object, plane) => {
  const id = uuid();
  const owner = plane === 3 ? undefined : plane === 2 ? instanceId : username;
  return product.li
    ? { [id]: { id, username: owner, userId: instanceId, ...product } }
    : {};
};

const configUI = {
  instructions: { 'ui:widget': 'textarea' },
  allowEditing: {
    conditional: formData => formData.submit || !formData.liTypeEditor
  }
};

const mergeFunction = async (obj: Object, dataFn: Object, data: Object) => {
  let empty = true;
  const category = obj.config.useInstructionsForCategory
    ? obj.config.category
    : undefined;
  if (!isEmpty(obj.data) && isObject(obj.data)) {
    const li = values(obj.data)?.[0]?.li;
    if (li) {
      if (obj.config.duplicateLI) {
        const newLI = await dataFn.duplicateLI(li);
        dataFn.objInsert({
          ...values(obj.data)[0],
          li: newLI,
          category
        });
        empty = false;
      } else {
        dataFn.objInsert({
          ...values(obj.data)[0],
          category
        });
        empty = false;
      }
    }
  }
  if (empty && obj.config.liTypeEditor && !data.li) {
    const newLI = dataFn.createLearningItem(obj.config.liTypeEditor);
    if (newLI) {
      dataFn.objInsert({ li: newLI, category });
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
