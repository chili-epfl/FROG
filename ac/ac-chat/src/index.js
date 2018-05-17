// @flow

import { type ActivityPackageT, uuid } from 'frog-utils';

import ActivityRunner from './Chat';
import dashboards from './Dashboard';

const learningItems = [
  {
    id: '1',
    liType: 'li-idea',
    payload: { title: 'Hi', content: 'Hello' },
    createdAt: '2018-05-10T12:02:07.525Z'
  },
  {
    id: '4',
    liType: 'li-image',
    payload: {
      thumburl: 'https://i.imgur.com/ypw3CGOb.jpg',
      url: 'https://i.imgur.com/ypw3CGO.jpg'
    },
    createdAt: '2018-05-10T12:05:08.700Z'
  }
];

const meta = {
  name: 'Chat',
  shortDesc: 'Chat component',
  description: 'Persistent text chat',
  exampleData: [
    {
      title: 'Chat with some messages',
      config: { title: 'Example chat' },
      data: [
        { order: 1, id: '1', msg: 'This is the first message', user: 'Ole' },
        {
          order: 2,
          id: '2',
          msg: "I don't agree, but we can discuss it",
          user: 'Petter'
        },
        {
          order: 3,
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
      title: 'Robot prompt (merge+config)',
      config: {
        title: 'Chat with robot',
        hasRobotPrompt: true,
        robotPrompt: 'Please discuss amongst yourself'
      },
      data: [
        { msg: 'John said Obama is the best' },
        { msg: 'Peter said John Travolta would be a good president' }
      ]
    },
    {
      title: 'Learning Items',
      config: {
        title: 'Learning Items'
      },
      learningItems,
      data: [
        { li: '4', user: 'Ole' },
        { msg: 'John said Obama is the best' },
        { li: '1', user: 'Nils' },
        {
          msg: 'Peter said John Travolta would be a good president',
          user: 'Romain'
        }
      ]
    }
  ]
};

const dataStructure = {};

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

const robotFormat = (id, msg, order) => ({
  id,
  msg,
  user: 'Friendly robot',
  order
});

const mergeFunction = (obj, dataFn) => {
  if (obj.config.hasRobotPrompt) {
    const id = uuid();
    dataFn.objInsert(robotFormat(id, obj.config.robotPrompt), id);
  }
  if (obj.data) {
    obj.data.forEach((x, i) => {
      const id = uuid();
      dataFn.objInsert(
        x.user
          ? { id, order: i + 1, ...x }
          : robotFormat(id, x.msg || x, i + 1),
        id
      );
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
