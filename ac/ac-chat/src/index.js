// @flow

import ActivityRunner from './Chat';

const meta = {
  name: 'Chat',
  type: 'react-component'
};

const dataStructure = [];

const config = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Title'
    },
    groupBy: {
      type: 'string',
      title: 'Grouping by',
      enum: ['role', 'group']
    }
  }
};

export default {
  id: 'ac-chat',
  ActivityRunner,
  config,
  meta,
  dataStructure
};
