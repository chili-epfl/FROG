// @flow

import ActivityRunner from './Chat';
import Dashboard from './Dashboard';

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
    }
  }
};

export default {
  id: 'ac-chat',
  ActivityRunner,
  Dashboard,
  config,
  meta,
  dataStructure
};
