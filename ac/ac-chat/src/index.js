// @flow

import { type ActivityPackageT, uuid } from 'frog-utils';

import ActivityRunner from './Chat';
import dashboards from './Dashboard';

const meta = {
  name: 'Chat',
  shortDesc: 'Chat component',
  description: 'Persistent text chat',
  exampleData: [
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
    },
    {
      title: 'Robot prompt through merge',
      config: { title: 'Chat with robot' },
      data: [{ msg: 'Nicole uploaded an image' }]
    },
    {
      title: 'Robot prompt through merge and with config',
      config: {
        title: 'Chat with robot',
        hasRobotPrompt: true,
        robotPrompt: 'Please discuss amongst yourself'
      },
      data: [
        { msg: 'John said Obama is the best' },
        { msg: 'Peter said John Travolta would be a good president' }
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
    },
    hasRobotPrompt: {
      type: 'boolean',
      title: 'Insert robot prompt at beginning of chat'
    },
    robotPrompt: { type: 'string', title: 'Robot prompt' }
  }
};

const configUI = { robotPrompt: { conditional: 'hasRobotPrompt' } };

const robotFormat = msg => ({
  msg,
  user: 'Friendly robot',
  id: uuid()
});

const mergeFunction = (obj, dataFn) => {
  if (obj.config.hasRobotPrompt) {
    dataFn.listAppend(robotFormat(obj.config.robotPrompt));
  }
  if (obj.data) {
    obj.data.forEach(x => {
      dataFn.listAppend(x.user ? x : robotFormat(x.msg || x));
    });
  }
};

export default ({
  id: 'ac-chat',
  type: 'react-component',
  ActivityRunner,
  config,
  configUI,
  meta,
  dataStructure,
  dashboards,
  mergeFunction
}: ActivityPackageT);
