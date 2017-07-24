// @flow

import { type ActivityPackageT } from 'frog-utils';

import ActivityRunner from './Chat';
import Dashboard from './Dashboard';

const meta = {
  name: 'Chat',
  type: 'react-component',
  shortDesc: 'Chat component',
  description: 'Persistent text chat',
  exampleData: [
    {
      title: 'Empty chat',
      config: { title: 'Example chat' },
      activityData: []
    },
    {
      title: 'Chat with some messages',
      config: { title: 'Example chat' },
      activityData: [
        { id: '1', msg: 'This is the first message', user: 'Ole' },
        {
          id: '2',
          msg: "I don't agree, but we can discuss it",
          user: 'Petter'
        },
        {
          id: '3',
          msg: 'Let us do an experiment to test our hypothesis',
          user: 'Alfons'
        }
      ]
    }
  ]
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
