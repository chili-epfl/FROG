// @flow

import { type ActivityPackageT } from 'frog-utils';

import ActivityRunner from './Chat';
import Dashboard from './Dashboard';

const meta = {
  name: 'Chat',
  type: 'react-component',
  shortDesc: 'chat between students',
  description: 'Opens a chat between the students of the considered group'
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

export default ({
  id: 'ac-chat',
  ActivityRunner,
  config,
  meta,
  dataStructure,
  Dashboard
}: ActivityPackageT);
