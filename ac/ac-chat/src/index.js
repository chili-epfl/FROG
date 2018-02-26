// @flow

import { type ActivityPackageT } from 'frog-utils';

import ActivityRunner from './Chat';
import dashboard from './Dashboard';

const meta = {
  name: 'Chat',
  shortDesc: 'Chat component',
  description: 'Persistent text chat',
  exampleData: [
    {
      title: 'Empty chat',
      config: { title: 'Example chat' },
      data: []
    },
    {
      title: 'Chat with some messages',
      config: { title: 'Example chat' },
      data: [
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

const mergeFunction = (obj, dataFn) => {
  if (obj.data) {
    obj.data.forEach(x => dataFn.listAppend(x));
  }
};

export default ({
  id: 'ac-chat',
  type: 'react-component',
  ActivityRunner,
  config,
  meta,
  dataStructure,
  dashboard,
  mergeFunction
}: ActivityPackageT);
